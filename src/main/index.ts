import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { AssetServer } from '../protocols/asset-server'
import { AssetUrl } from '../protocols/asset-url'
import vm from 'vm'
import parseJavaScript from '../renderer/src/runners/typescript/parser'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true // protect against prototype pollution,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Registers custom schemes as privileged with specific privileges.
// This is used to define a custom protocol scheme ('app-asset') that has elevated privileges.
// The privileges include:
// - standard: Allows the scheme to be treated as a standard scheme.
// - supportFetchAPI: Enables the use of the Fetch API with this scheme.
// - bypassCSP: Allows the scheme to bypass Content Security Policy (CSP) checks.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app-asset',
    privileges: {
      standard: true,
      supportFetchAPI: true,
      bypassCSP: true
    }
  }
])

const server = new AssetServer()

ipcMain.handle('run-code', (_, code: string) => {
  return new Promise((resolve, reject) => {
    const ast = parseJavaScript(code)
    const results = new Array(ast?.loc?.end.line).fill(undefined)

    const sandbox = {
      Logger: (lineIndex: number, ...args: never[]): void => {
        const formattedValue = args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
          .join(' ')

        if (results[lineIndex - 1] === undefined) {
          results[lineIndex - 1] = formattedValue + ' '
        } else {
          results[lineIndex - 1] += formattedValue + ' '
        }
      }
    }

    vm.createContext(sandbox)

    if (!ast) {
      return resolve(results)
    }

    ast.body.forEach((node) => {
      const nodeSource = code.slice(node.range[0], node.range[1])

      if (node.type === 'ExpressionStatement' && node.expression.type === 'Literal') {
        results[node.loc.start.line - 1] = node.expression.value
      }

      try {
        vm.runInContext(nodeSource, sandbox)
      } catch (error) {
        results[node.loc.start.line - 1] = `Error: ${error.message}`
      }
    })

    resolve(results)
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Handles requests for the 'app-asset' custom protocol.
  // The handler function processes the incoming request and determines the source of the requested asset.
  // It first creates a URL object from the request URL.
  // Then, it creates an AssetUrl instance to encapsulate the URL and provide additional functionality.
  // If the asset is identified as a Node.js module, it fetches the asset from the Node.js modules directory using server.fromNodeModules().
  // Otherwise, it fetches the asset from the public directory using server.fromPublic().
  protocol.handle('app-asset', (request) => {
    const urlStringToURL = new URL(request.url)
    const asset = new AssetUrl(urlStringToURL)

    if (asset.isNodeModule) {
      return server.fromNodeModules(asset.relativeURL)
    } else {
      return server.fromPublic(asset.relativeURL)
    }
  })

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

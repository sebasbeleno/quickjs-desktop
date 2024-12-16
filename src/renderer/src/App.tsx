import { loader } from '@monaco-editor/react'
import CodeEditor from './components/CodeEditor'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ExecutionResult from './components/ExecutionResult'
import { ipcMain, ipcRenderer } from 'electron'
import electron from 'electron'
import { Provider } from 'react-redux'
import { store } from './store'

loader.config({
  paths: {
    vs: 'app-asset://quickjs/node_modules/monaco-editor/min/vs'
  }
})

function App(): JSX.Element {
  /* function handleCkick(): void {
    console.log(window.api.invoke('run-code', 'hello'))
  } */
  return (
    <Provider store={store}>
      <PanelGroup direction="horizontal">
        <Panel minSize={20}>
          <CodeEditor />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <ExecutionResult />
        </Panel>
      </PanelGroup>
    </Provider>
  )
}

export default App

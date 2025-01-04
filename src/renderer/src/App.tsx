import { loader, useMonaco } from '@monaco-editor/react'
import CodeEditor from './components/CodeEditor'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ExecutionResult from './components/ExecutionResult'
import { Provider } from 'react-redux'
import { store } from './store'
import Layout from './components/Layout'
import { EditorTheme } from './config/themeOptions'
import { useEffect } from 'react'
import AuraDarkTheme from './themes/aura-dark'

loader.config({
  paths: {
    vs: 'app-asset://quickjs/node_modules/monaco-editor/min/vs'
  }
})

function App(): JSX.Element {
  const monaco = useMonaco()

  const theme: EditorTheme = 'aura-dark'

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('aura-dark', AuraDarkTheme)
      monaco.editor.setTheme('aura-dark')
    }
  }, [monaco])
  return (
    <Provider store={store}>
      <Layout>
        <PanelGroup direction="horizontal">
          <Panel minSize={20}>
            <CodeEditor theme={theme} />
          </Panel>
          <PanelResizeHandle />
          <Panel>
            <ExecutionResult />
          </Panel>
        </PanelGroup>
      </Layout>
    </Provider>
  )
}

export default App

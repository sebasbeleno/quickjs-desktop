import { loader } from '@monaco-editor/react'
import CodeEditor from './components/CodeEditor'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ExecutionResult from './components/ExecutionResult'
import { Provider } from 'react-redux'
import { store } from './store'
import Layout from './components/Layout'

loader.config({
  paths: {
    vs: 'app-asset://quickjs/node_modules/monaco-editor/min/vs'
  }
})

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Layout>
        <PanelGroup direction="horizontal">
          <Panel minSize={20}>
            <CodeEditor />
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

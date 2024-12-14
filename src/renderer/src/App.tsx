import { loader } from '@monaco-editor/react'
import CodeEditor from './components/CodeEditor'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ExecutionResult from './components/ExecutionResult'

loader.config({
  paths: {
    vs: 'app-asset://quickjs/node_modules/monaco-editor/min/vs'
  }
})

function App(): JSX.Element {
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel minSize={20}>
          <CodeEditor />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <ExecutionResult />
        </Panel>
      </PanelGroup>
    </>
  )
}

export default App

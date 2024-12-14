import Editor from '@monaco-editor/react'
import { loader } from '@monaco-editor/react'

loader.config({
  paths: {
    vs: 'app-asset://quickjs/node_modules/monaco-editor/min/vs'
  }
})

function App(): JSX.Element {
  return (
    <>
      <Editor
        height="100vh"
        width="100%"
        language="javascript"
        theme="dark"
        value="// write your code here"
      />
    </>
  )
}

export default App

import { Editor } from '@monaco-editor/react'

const ExecutionResult: React.FC = () => {
  return (
    <Editor
      height="100vh"
      width="100%"
      options={{
        readOnly: true,
        smoothScrolling: true,
        minimap: {
          enabled: false
        },
        contextmenu: false,
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'hidden'
        },
        guides: {
          indentation: false
        }
      }}
      language="javascript"
    />
  )
}

export default ExecutionResult

import { Editor } from '@monaco-editor/react'

const CodeEditor: React.FC = () => {
  return (
    <Editor
      height="100vh"
      width="100%"
      options={{
        readOnly: false,
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

export default CodeEditor

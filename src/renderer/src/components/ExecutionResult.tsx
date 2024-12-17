import { Editor } from '@monaco-editor/react'
import { RootState } from '@renderer/store'
import { useSelector } from 'react-redux'

const ExecutionResult: React.FC = () => {
  const currentFileExecutionResult = useSelector(
    (state: RootState) => state.files.currentFile.codeExecutionResult
  )
  return (
    <Editor
      value={currentFileExecutionResult ? currentFileExecutionResult : ''}
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

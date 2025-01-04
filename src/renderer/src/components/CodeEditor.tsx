import { Editor } from '@monaco-editor/react'
import { EditorTheme } from '@renderer/config/themeOptions'
import { selectCurrentFile, updateFileContent } from '@renderer/store/slices/filesSlice'
import { getLanguageFromFilename } from '@renderer/utils'
import { useDispatch, useSelector } from 'react-redux'

interface CodeEditorProps {
  theme: EditorTheme
}

const CodeEditor: React.FC<CodeEditorProps> = ({ theme }: CodeEditorProps) => {
  const currentFile = useSelector(selectCurrentFile)
  const dispatch = useDispatch()
  return (
    <Editor
      height="100vh"
      width="100%"
      value={currentFile ? currentFile.content : ''}
      onChange={(value) => {
        if (value) {
          dispatch(updateFileContent({ id: currentFile.id, content: value }))
        }
      }}
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
      language={getLanguageFromFilename(currentFile ? currentFile.name : '')}
      theme={theme}
    />
  )
}

export default CodeEditor

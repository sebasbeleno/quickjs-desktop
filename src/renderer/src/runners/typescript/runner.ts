import parseJavaScript from './parser'
import { transform } from 'sucrase'
import transformCode from './transformCode'
import { store } from '../../store'
import { updateCodeExecutionResult } from '@renderer/store/slices/filesSlice'

function transformTypescriptCode(code: string): string {
  try {
    return transform(code, {
      transforms: ['typescript']
    }).code
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`
    } else {
      return 'Unknown error'
    }
  }
}

function runTypescript(code: string): void {
  code = transformTypescriptCode(code)
  const ast = parseJavaScript(code)

  if (!ast) {
    return
  }

  console.log(ast)

  const transformedCode = transformCode(ast)

  window.api
    .invoke('run-code', transformedCode)
    .then(function (res) {
      store.dispatch(updateCodeExecutionResult(res.join('\n')))
    })
    .catch(function (err) {
      console.error(err) // will print "This didn't work!" to the browser console.
    })
}

export default runTypescript

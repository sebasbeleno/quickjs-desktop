import parseJavaScript from './parser'
import vm from 'vm';

function runTypescript(code: string): void {
  const ast = parseJavaScript(code)
  if (!ast) {
    return
  }

  const context = vm.createContext()

  console.log('Running code...')
  console.log(context)

  console.log(ast)
}

export default runTypescript

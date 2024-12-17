import { parseScript, Program } from 'esprima'

export default function parseJavaScript(code: string): Program | undefined {
  try {
    const ast = parseScript(code, {
      loc: true,
      range: true
    })

    return ast
  } catch (error) {
    console.error(error)
  }

  return undefined
}

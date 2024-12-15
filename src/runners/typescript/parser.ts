import esprima from 'esprima'

export default function parseJavaScript(code: string): esprima.Program | undefined {
  try {
    const ast = esprima.parseScript(code, {
      loc: true,
      range: true
    })

    return ast
  } catch (error) {
    console.error(error)
  }

  return undefined
}

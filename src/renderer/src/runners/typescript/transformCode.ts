import { Program } from 'esprima'
import estraverse from 'estraverse'
import escodegen from 'escodegen'

function transformCode(ast: Program): string {
  estraverse.replace(ast, {
    leave(node) {
      // replace console.log with Logger
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'console' &&
        node.callee.property.name === 'log'
      ) {
        return {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'Logger'
          },
          arguments: [
            {
              type: 'Literal',
              value: node.loc.start.line
            },
            ...node.arguments
          ]
        }
      }

      // replace binary expression with custom eval function

      if (node.type === 'ExpressionStatement' && node.expression.type === 'BinaryExpression') {
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'Logger'
            },
            arguments: [
              {
                type: 'Literal',
                value: node.loc.start.line
              },
              {
                type: 'BinaryExpression',
                left: node.expression.left,
                right: node.expression.right,
                operator: node.expression.operator
              }
            ]
          }
        }
      }

      if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'Logger'
            },
            arguments: [
              {
                type: 'Literal',
                value: node.loc.start.line
              },
              {
                type: 'CallExpression',
                callee: node.expression.callee,
                arguments: node.expression.arguments
              }
            ]
          }
        }
      }

      if (node.type === 'ExpressionStatement' && node.expression.type === 'Identifier') {
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'Logger'
            },
            arguments: [
              {
                type: 'Literal',
                value: node.loc.start.line
              },
              {
                type: 'Identifier',
                name: node.expression.name
              }
            ]
          }
        }
      }
    }
  })

  return escodegen.generate(ast)
}

export default transformCode

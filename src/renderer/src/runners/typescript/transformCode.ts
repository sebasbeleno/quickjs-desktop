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

      // when the user is calling a function wrapped in with Logger
      if (
        node.type === 'ExpressionStatement' &&
        node.expression.type === 'CallExpression' &&
        node.expression.callee.name !== 'Logger'
      ) {
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

      // this scenario is when the user is calling a variable
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

      // this scenario is when the user is calling a literal. e.g. 1, 'hello', true
      if (node.type === 'ExpressionStatement' && node.expression.type === 'Literal') {
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
              node.expression
            ]
          }
        }
      }

      if (node.type === 'ExpressionStatement' && node.expression.type === 'UnaryExpression') {
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
                type: 'UnaryExpression',
                operator: node.expression.operator,
                argument: node.expression.argument
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

import { parseHTML } from './parseAst'
import { generate } from './generate'

export function compileToFunction(el) {
  // 1、将html变成ast语法树
  const ast = parseHTML(el)

  // 2、ast转render字符串
  const code = generate(ast)
}
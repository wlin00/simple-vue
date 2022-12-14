import { parseHTML } from './parseAst'
import { generate } from './generate'

export function compileToFunction(el) {
  // 1、将html变成ast语法树
  const ast = parseHTML(el)
  console.log('ast', ast)

  // 2、ast转render字符串
  const code = generate(ast)
  console.log('render', code)

  // 3、render字符串转render函数
  const renderFn = new Function(`with(this){return ${code}}`)

  return renderFn // html -> ast -> render function
}
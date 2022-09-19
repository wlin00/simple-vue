// 将ast语法树变成render函数（先生成render字符串，然后生成render函数）
/**
  before: <div id="app"> hello {{msg}} </div>
  after:  render() { // _c代表createElement，_v是值域，_s用于解析插值表达式
            return _c('div', { id: app }, _v('hello' + _s(msg)))
          }
*/ 
export function generate(ast) {
  console.log('get - ast', ast)

}
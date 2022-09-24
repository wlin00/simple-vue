const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配差值表达式

// 将ast语法树变成render函数（先生成render字符串，然后生成render函数）
/**
  before: <div id="app"> hello {{msg}} </div>
  after:  render() { // _c代表createElement，_v是值域，_s用于解析插值表达式
            return _c('div', { id: app }, _v('hello' + _s(msg)))
          }
*/ 

// 需要处理属性和子元素， 且需要特殊处理名为style的属性，如下：
// before： <div id="app" style="color: red;font-size: 20px;">hello {{msg}}</div>
// after ： _c(div, {id:"app",style:{"color":"red","font-size":"20px"}}, _v('hello'+_s(msg)))

export function generate(ast) { // 输入ast节点，生成render字符串
  const children = getAstChildren(ast) // 获取ast子集字符串如：_v('hello' + _s(msg))
  let code = `_c(
    '${ast.tag}',  
    ${ast.attrs.length ? `${genProps(ast.attrs)}` : 'null'},
    ${children ? `${children}` : 'null'}
  )`
  return code
}

function getAstChildren (ast) { // 获取ast子集字符串如：_v('hello' + _s(msg))
  let children = ast.children
  if (children) {
    return children.map(child => generateChildStr(child)).join(',') // 用generateChildStr处理子集字符
  }
}

function generateChildStr(ast) { // 生成子集字符
  // 转ast子集为字符串，区分当前ast节点类型是dom还是文本，是文本的话，区分是否有差值表达式有的话用_s包裹
  if (ast.type === 1) { // dom类型，直接递归获取子集的render字符串
    return generate(ast)
  } else { // 文本类型， 区分当前是纯文本还是带{{}}表达式的
    const text = ast.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})` // 若是纯文本直接返回_v包裹字符串
    } else {
      // 若带有{{}}, 返回 _v('hello' + _s(msg))
      const tokens = [] // 用于存放每部分的子集字符串
      let lastIndex = defaultTagRE.lastIndex = 0 // 设置当前“下一轮匹配开始下标”默认值为0，并且每次获取时重置正则的使用lastIndex
      let match
      while (match = defaultTagRE.exec(text)) { // 正则分组匹配
        let index = match.index
        if (index > lastIndex) { // 若当前差值表达式前还有字符串，收集这些纯文本
          tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 先推入非差值表达式入tokens，收集纯文本时需要JSON序列化
        }
        // 收集当前匹配的差值表达式
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length // 更新下一轮匹配开始下标       
      }
      // 查看当前匹配完后是否还有普通文本，有的话收集
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex))) // 先推入非差值表达式入tokens, 收集纯文本时需要JSON序列化
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      const list = attr.value.split(';').filter((item) => item !== '')
      if (list.length) {
        list.forEach((cssItem) => {
          const [cssKey, cssVal] = cssItem.split(':')
          obj[cssKey.trim()] = cssVal.trim()
        })
      }
      attr.value = obj // 重写名为style的属性的value为对象的结构
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}` // 返回一个对象，并删除最后一个逗号
}
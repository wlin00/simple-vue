// 解析html的开始tag头、属性、开始tag尾、文本、结束tag，会用到以下正则表达式进行匹配
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配差值表达式

// 定义变量用于存储生成后的ast
let root = null // root表示ast语法树的根节点
let createParent = null
let stack = [] // 模版解析类似括号匹配算法，用栈来模拟

// 生成ast语法树方法
function createASTElement (tag, attrs) {
  return {
    tag,
    attrs,
    children: [],
    parent: null,
    type: 1 // 默认生成Dom类型1， （文本类型为3）
  }
}

// 三大基础方法，用于转换html 为 ast对象
function startFn(tag, attrs) { // 遇到开始标签，当前ast元素进栈
  let element = createASTElement(tag, attrs)
  if (!root) {
    root = element
  }
  createParent = element
  stack.push(element)
}
function chartsFn(text) { // 遇到文本，去除文本多余空格后，作为文本节点添加到当前父节点的孩子节点
  // text = text.replace(/\s/g, '') // /\s/g匹配所有空格
  if (!text) {
    return
  }
  createParent.children.push({
    type: 3, // 文本节点type为3
    text // 文本节点的属性只有text值和type类型
  })
}
function endFn(tag) { // 遇到结束标签，当前ast元素出栈
  let element = stack.pop()
  // 更新当前节点的父节点（取栈顶）
  createParent = stack[stack.length - 1] // 取出栈顶，若存在，则标记为当前元素的parent
  if (createParent) { // 出栈的时候，维护parent和children的关系信息
    element.parent = createParent.tag
    createParent.children.push(element) // 在处理子节点的时候，会更新父节点的children信息
  }
}



export function parseHTML(html) {
  while (html) {
    let textEnd = html.indexOf('<') // 先判断当前匹配的是开始标签、文本、还是结束标签
    if (textEnd === 0) { // 若当前是标签开头
      // (1)：当前是开始标签 - 当前标签的ast节点进栈
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        startFn(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // (2)：当前是结束标签 - 当前标签的ast节点出栈，并更新当前节点的parent信息以及当前父节点的children信息（如果当前节点非root的话）
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        endFn(endTagMatch[1])
        continue
      }
    }
    // 若当前是文本
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chartsFn(text)
    }
  }
  return root // 返回解析后的ast语法树

  function parseStartTag() { // 处理开始标签（开始标签头/属性/尾）
    const start = html.match(startTagOpen)
    if (start) { // 若匹配到开始标签，则新建一个match对象用于存储当前开始标签的信息，并在原html中删除它
      let match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 删除原html中的开始标签头部部分
      let attr, end // 处理开始标签的属性 & 标签尾部
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 以name - value的键值对的形式，收集属性信息到attrs数组里
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length) // 删除原html中开始标签中的属性
      }
      if (end) {
        advance(end[0].length) // 删除原html中开始标签的标签尾部
        return match
      }
    }
  }

  function advance(count) { // 删除当前已匹配的count个数的html字符串
    html = html.substring(count)
  }
}
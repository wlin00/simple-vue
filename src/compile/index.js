import { text } from "stream/consumers"

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

// 三大基础方法，用于转换html 为 ast对象
function startFn(tag, attrs) {
  console.log(tag, attrs, '开始')
}
function chartsFn(text) {
  console.log(text, '文本')
}
function endFn(tag) {
  console.log(tag, '结束')
}

export function compileToFunction(el) {
  let ast = parseHTML(el)
}

function parseHTML(html) {
  console.log('hh', html)
  while (html) {
    let textEnd = html.indexOf('<') // 先判断当前匹配的是开始标签、文本、还是结束标签
    if (textEnd === 0) { // 若当前是标签开头
      // (1)：当前是开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        startFn(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // (2)：当前是结束标签
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
    console.log('get html', html)
  }
}
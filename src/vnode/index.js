// vnode 结构
/**
 * 
 * {
 *   tag,
 *   data,
 *   key,
 *   children,
 *   text,
 * }
 * 
 */

export function renderMixin(Vue) {
  Vue.prototype._render = function () { // 初始化原型的render - render函数转虚拟Dom
    let vm = this
    let render = vm.$options.render
    let vnode = render.call(this)
    console.log('vnode', vnode)
    return vnode
  }

  Vue.prototype._c = function() { // render函数生成虚拟Dom的过程中，中对元素的处理
    return createElement(...arguments)
  }
  
  Vue.prototype._v = function(text) { // render函数生成虚拟Dom的过程中，中对文本的处理
    return createText(text)
  }

  Vue.prototype._s = function(val) { // render函数生成虚拟Dom的过程中，中对{{}}中的变量（差值表达式)的处理
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }
}

// 工具方法 - 创建元素虚拟节点
function createElement(tag, data, ...children) {
  return vnode(tag, data, (data || {}).key, 1, children) // 元素节点type为1
}

// 工具方法 - 创建文本虚拟节点
function createText(text) {  // 元素节点type为3
  return vnode(undefined, undefined, undefined, 3, undefined, text) // tag、data、key、children、text
}

// 工具方法 - 创建vnode
function vnode(tag, data, key, type, children, text) {
  return {
    tag,
    data,
    key,
    type,
    children,
    text
  }
}

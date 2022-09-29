export function patch(oldDom, vNode) {
  // 虚拟Dom生成真实Dom
  const el = createEl(vNode)
  // 渲染真实Dom-非Diff版 （1）获取oldDom的父节点，（2）添加新节点（3）删除原来节点 
  let parentNode = oldDom.parentNode
  parentNode.insertBefore(el, oldDom.nextsibling) // 在老节点的下一跳前插入新节点（即插入到老节点后面）
  parentNode.removeChild(oldDom) // 删除老节点
  return el // 返回当前最新的Dom元素el
}

function createEl(vNode) {
  // 获取虚拟Dom的各个属性
  const { tag, data, key, type, children, text } = vNode
  // 虚拟Dom生成真实Dom，处理元素节点和文本节点
  if (vNode.type === 1) { // 元素节点
    vNode.el = document.createElement(tag)
    // 处理属性
    if (data !== null && typeof data === 'object') {
      const keys = Object.keys(data)
      if (!keys.length) {
        return
      }
      keys.forEach((key) => {
        if (key !== 'style') {
          // 处理非style的属性，直接添加
          vNode.el.setAttribute(key, data[key])
        } else {
          // 处理style属性, 给元素节点添加样式
          const styleObj = data[key]
          let styleStr = ''
          if (styleObj !== null && typeof styleObj === 'object') {
            const styleKeys = Object.keys(styleObj)
            if (!styleKeys.length) {
              return
            }
            styleKeys.forEach((styleKey) => {
              styleStr += `${styleKey}:${styleObj[styleKey]};`
            })
            vNode.el.setAttribute(key, styleStr)
          }
        }
      })

    }
    // 处理子节点
    if (vNode.children && vNode.children.length) {
      vNode.children.forEach((child) => {
        vNode.el.appendChild(createEl(child)) // 递归添加子节点
      })
    }
  } else if (vNode.type === 3) { // 文本节点
    vNode.el = document.createTextNode(text)
  }
  return vNode.el
}
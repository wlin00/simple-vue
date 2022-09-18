import { initState } from './state'
import { compileToFunction } from './compile/index'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    console.log('vm', this)
    const vm = this
    vm.$el = document.querySelector(options.el)
    vm.$options = options
    vm.$data = options.data
    vm._self = vm
    // init Mixin里的初始化方法， 先进行选项合并、初始化生命周期 & 事件中心 &initState初始化状态
    initState(vm)
    
    // 一系列初始化结束后，会执行$mount方法来进行模版编译（vue runtime with compile 版本）
    if (vm.$options.el) {
      vm.$mount(vm.$options.el) // 模版编译
    }
  }

  Vue.prototype.$mount = function (el) {
    // 先看有无render， 若无则先看有无templat，有的话template转render / 无的话取el.outerHTML作为template
    const vm = this
    el = document.querySelector(el) // 获取dom元素
    const options = vm.$options
    if (!options.render) { // 若无render
      const template = options.template
      if (el && !template) { //若无template，走el的outerHTML进行模版编译
        el = el.outerHTML
        compileToFunction(el) // html -> ast -> render
      }
    }
  }
}
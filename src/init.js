import { initState } from './state'
import { compileToFunction } from './compile/index'
import { mountComponent, callHook } from './lifeCycle'
import { mergeOptions } from './utils/merge'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    console.log('vm', this, 'Vue.options', Vue.options)
    const vm = this
    
    vm.$options = mergeOptions(Vue.options, options) // 选项合并
    callHook(vm, 'beforeCreate') // 生命周期钩子调用：状态初始化前 -> beforeCreate
    vm.$data = options.data
    vm._self = vm

    // init Mixin里的初始化方法， 先进行选项合并、初始化生命周期 & 事件中心 &initState初始化状态
    initState(vm)
    callHook(vm, 'created') // 生命周期钩子调用：状态初始化前 -> beforeCreate
    
    // 一系列初始化结束后，会执行$mount方法来进行模版编译（vue runtime with compile 版本）
    if (vm.$options.el) {
      vm.$mount(vm.$options.el) // 模版编译
    }
  }

  Vue.prototype.$mount = function (el) {
    // 先看有无render， 若无则先看有无templat，有的话template转render / 无的话取el.outerHTML作为template
    const vm = this
    el = document.querySelector(el) // 获取dom元素
    vm.$el = el // 在$mount后能获取到$el
    const options = vm.$options
    if (!options.render) { // 若无render
      const template = options.template
      if (el && !template) { //若无template，走el的outerHTML进行模版编译
        el = el.outerHTML
        const render = compileToFunction(el) // html -> ast -> render
        // 有了render函数后，存储到vm，
        options.render = render
        // 后续流程：（1）render函数转虚拟Dom；（2）虚拟Dom转真实Dom（3）渲染页面
      }
    }
    // 若有render 则可以直接走后续流程：mountComponent来转render为虚拟Dom -> 转真实Dom -> 渲染（挂载组件）
    mountComponent(vm, el)
  }
}
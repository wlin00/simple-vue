import { patch } from './vnode/patch'

export function mountComponent(vm, el) { // 挂载方法
  callHook(vm, 'beforeMount') // 生命周期钩子调用：状态初始化前 -> beforeMount
  // (1)render转虚拟Dom（2）虚拟Dom转真实Dom（3）真实Dom渲染
  vm._update(vm._render()) // _render: render函数转虚拟Dom；_update: 虚拟Dom转真实Dom
  callHook(vm, 'mounted') // 生命周期钩子调用：状态初始化前 -> beforeMount
}

export function lifeCycleMixin(Vue) { // 初始化vm._update
  Vue.prototype._update = function (vnode) {
    let vm = this
    vm.$el = patch(vm.$el, vnode) // 虚拟Dom转真实Dom & 完成页面渲染，并更新vm.$el为最新dom
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers && handlers.length) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(this)
    }
  }
}
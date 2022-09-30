import { patch } from './vnode/patch'
import Watcher from './observe/watcher'

export function mountComponent(vm, el) { // 挂载方法
  callHook(vm, 'beforeMount') // 生命周期钩子调用：状态初始化前 -> beforeMount

  // mountComponent里主要做的事情：
  // (1)render转虚拟Dom（2）虚拟Dom转真实Dom（3）真实Dom渲染
  // vm._update(vm._render()) // 核心代码 -> _render: render函数转虚拟Dom；_update: 虚拟Dom转真实Dom

  // 下面使用watcher来建立和视图的1:1绑定关系，来完成视图渲染；
  // 并且具备更多功能如和dep建立多对多的绑定 & 视图更新 & 计算属性等
  const updateComponent = () => vm._update(vm._render())
  const a = new Watcher(vm, updateComponent, () => {}, true) // 构造函数的参数分别是：(1)vm实例（2）更新视图方法（3）空对象用于计算属性（4）是否是渲染watcher
  console.log(a)
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
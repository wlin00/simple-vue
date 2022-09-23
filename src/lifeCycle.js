export function mountComponent(vm, el) {
  // 挂载方法：(1)render转虚拟Dom（2）虚拟Dom转真实Dom（3）真实Dom渲染
  vm._update(vm._render()) // _render: render函数转虚拟Dom；_update: 虚拟Dom转真实Dom
}

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {

  }
}
import { initState } from './state'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    console.log('op', options)
    const vm = this
    vm.$el = document.querySelector(options.el)
    vm.$options = options
    vm.$data = options.data
    vm._self = vm
    initState(vm)
  }
}
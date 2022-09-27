import { mergeOptions } from '../utils/merge.js' // 选项合并
export function initGlobalApi (Vue)  {
  // 在Vue.options全局初始化当前vm.$options中的各个选项，转化为一个map的结构如： Vue.options = { created: [a, b, c] }
  Vue.options = {}
  Vue.Mixin = function (mixin) { // 定义静态方法Mixin
    this.options = mergeOptions(this.options, mixin)
  }
}
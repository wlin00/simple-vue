import { initMixin } from './init'
import { lifeCycleMixin } from './lifeCycle'
import { renderMixin } from './vnode/index'
import { initGlobalApi } from './global-api/index'

function Vue (options) {
  this._init(options)
}
initMixin(Vue) // 原型上挂载初始化mixin（选项合并、生命周期、事件中心、initState）
lifeCycleMixin(Vue) // 原型上挂载生命周期mixin，初始化挂载等方法
renderMixin(Vue) // 原型上挂载渲染mixin，初始化_render等方法用于转换render函数为虚拟Dom
initGlobalApi(Vue) // 全局静态方法初始化

export default Vue
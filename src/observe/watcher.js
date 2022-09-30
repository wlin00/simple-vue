import { pushTarget, popTarget } from './dep'
var id = 0
class Watcher {
  // 构造函数四个参数：
  // 1 - vm实例
  // 2 - 渲染更新视图方法
  // 3 - cb用于计算属性的缓存依赖
  // 4 - 选项表示当前是否是渲染watcher
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.id = id++
    this.options = options
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    }
    this.get() // 构造函数自调用，初次渲染视图
  }
  // 初次渲染视图 - 会在dep中标记当前模版编译处理的watcher
  get() {
    pushTarget(this)
    this.getter && this.getter()
    popTarget()
  }
  // 更新视图
  update() {
    this.getter && this.getter()
  }
}

export default Watcher
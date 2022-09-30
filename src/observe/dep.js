class Dep {
  // dep和vm中的属性有1:1的对应关系，dep的创建是在数据挟持中，每个属性的defineReactive里
  constructor() {
    this.subs = [] // dp和watcher多对多关系，subs用于存放watcher数组
  }
  // depend用于收集watcher。每个vm对应一个watcher，dep收集watcher是发生在数据挟持的get方法
  depend() {
    // depend调用时，代表触发了数据挟持的get方法，来把当前模版编译的vm所对应的watcher推到对应属性的订阅器dep中
    // 标记Dep.target 会在当前模版编译的watcher初次渲染时添加，在渲染后去除
    this.subs.push(Dep.target) 
  }
  // 订阅器更新watcher - 发生在数据挟持的set
  notify() {
    const subs = this.subs.slice()
    console.log('sss', subs)
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
export function pushTarget (watcher) {
  Dep.target = watcher
}
export function popTarget (watcher) {
  Dep.target = null
}


export default Dep
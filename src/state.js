import { observe } from './observe/index'
export function initState (vm) {
  const options = vm.$options
  if (options.props) {

  }
  if (options.methods) {
    
  }
  if (options.data) {
    initData(vm)
  }
}

function initData(vm) {
  console.log(vm)
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data || {}
  vm._data = data
  observe(data)
  Object.keys(data).forEach((key) => Object.defineProperty(vm, key, {
    enumerable: true, // 可枚举
    configurable: true, // 可删除
    get() {
      return vm['_data'][key] // 若vm上没有data中的某个属性如name，则Object.defineProperty会为其创建属性
    },
    set(val) {
      vm['_data'][key] = val
    },
  }))
}


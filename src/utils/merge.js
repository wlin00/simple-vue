// 对象合并， 定义一个全局的map用于合并所有选项，在map内的每个key用数组来存储
export const HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed'
]
const map = {}
map.data = function(parentObj, childObj) {
  return childObj
}
map.computed = function() {}
map.watch = function() {}
map.methods = function() {}

// 遍历生命周期list，为每个钩子函数定义对应处理方法
HOOKS.forEach((hook) => {
  map[hook] = function(parentOptions, childOptions) {
    if (childOptions) {
      if (parentOptions) {
        return parentOptions.concat(childOptions)
      } else {
        return [childOptions]
      }
    } else {
      return parentOptions
    }
  }
})

export function mergeOptions(parentOptions, childOptions) { // 合并父子选项
  const options = {}
  for (let key in parentOptions) {
    merge(key)
  }
  for (let key in childOptions) {
    merge(key)
  }
  function merge(key) { // 将外部mixin中的选项和当前vm的选项合并，合并至$options
    if (map[key]) {
      // 若map中有对应key，则调用对应钩子函数的处理方法, 收集结果到合并后的选项
      options[key] = map[key](parentOptions[key], childOptions[key]) // 策略模式减少if-else语句 -> 合并全局的生命周期

    } else {
      options[key] = childOptions[key] // 若map中没有对应key的默认处理
    }
  }
  return options
}
const oldArrayPrototype = Array.prototype
export const newArrayPrototype = Object.create(oldArrayPrototype)

const methods = [
  'push', 
  'pop',
  'splice',
  'shift', 
  'unshift', 
  'sort', 
  'reverse'
]

methods.forEach((method) => {
  newArrayPrototype[method] = function (...args) {
    const result = oldArrayPrototype[method].apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;    
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    return result
  }
})
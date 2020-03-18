import isPrototype from '../utils/isPrototype'

// 初始化对象克隆
function initCloneObject(object) {
  return (typeof object.constructor === 'function' && !isPrototype(object))
    ? Object.create(Object.getPrototypeOf(object))
    : {}
}

export default initCloneObject

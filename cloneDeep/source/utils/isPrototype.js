const objectProto = Object.prototype

/**
 * 检查“value”是否可能是原型对象
 */
function isPrototype(value) {
  const Ctor = value && value.constructor
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

  return value === proto
}

export default isPrototype

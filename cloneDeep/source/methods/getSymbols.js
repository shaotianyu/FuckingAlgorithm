const propertyIsEnumerable = Object.prototype.propertyIsEnumerable

const nativeGetSymbols = Object.getOwnPropertySymbols

/**
 * 返回对象中，可枚举的symbols属性的数组
 */
function getSymbols(object) {
  if (object == null) {
    return []
  }
  object = Object(object)
  return nativeGetSymbols(object).filter((symbol) => propertyIsEnumerable.call(object, symbol))
}

export default getSymbols

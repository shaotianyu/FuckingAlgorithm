import getSymbols from './getSymbols.js'

/**
 * 返回对象中，可枚举的symbols属性的数组
 */
function getSymbolsIn(object) {
  const result = []
  while (object) {
    result.push(...getSymbols(object))
    object = Object.getPrototypeOf(Object(object))
  }
  return result
}

export default getSymbolsIn

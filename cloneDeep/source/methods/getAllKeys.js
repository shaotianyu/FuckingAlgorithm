import getSymbols from './getSymbols'
import keys from './keys'

/**
 * 返回当前object的所有实例属性和symbol属性集合
 */
function getAllKeys(object) {
  const result = keys(object)
  if (!Array.isArray(object)) {
    result.push(...getSymbols(object))
  }
  return result
}

export default getAllKeys

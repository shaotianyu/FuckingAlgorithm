import isArguments from '../utils/isArguments'
import isBuffer from '../utils/isBuffer'
import isIndex from '../utils/isIndex'
import isTypedArray from '../utils/isTypedArray'

const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 返回可枚举的属性名队列
 */
function arrayLikeKeys(value, inherited) {
  const isArr = Array.isArray(value)
  const isArg = !isArr && isArguments(value)
  const isBuff = !isArr && !isArg && isBuffer(value)
  const isType = !isArr && !isArg && !isBuff && isTypedArray(value)
  const skipIndexes = isArr || isArg || isBuff || isType
  const length = value.length
  const result = new Array(skipIndexes ? length : 0)
  let index = skipIndexes ? -1 : length
  while (++index < length) {
    result[index] = `${index}`
  }
  for (const key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
          // Safari 9下有可枚举的`arguments.length`
          (key === 'length' ||
           isIndex(key, length))
        ))) {
      result.push(key)
    }
  }
  return result
}

export default arrayLikeKeys

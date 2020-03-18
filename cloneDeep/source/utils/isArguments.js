import getTag from '../methods/getTag'
import isObjectLike from './isObjectLike'

/**
 * 判断是不是arguments类型的数据
 * isArguments(function() { return arguments }())
 * // => true
 *
 * isArguments([1, 2, 3])
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && getTag(value) == '[object Arguments]'
}

export default isArguments

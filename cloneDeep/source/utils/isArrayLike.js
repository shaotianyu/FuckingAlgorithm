import isLength from './isLength.js'

/**
 * 判断当前值是否存在有效的length属性
 * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike(document.body.children)
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike(Function)
 * // => false
 */
function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length)
}

export default isArrayLike

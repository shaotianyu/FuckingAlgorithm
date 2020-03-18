const MAX_SAFE_INTEGER = 9007199254740991

/**
 * 检查“value”是否为有效的数组长度
 * 
 * isLength(3)
 * // => true
 *
 * isLength(Number.MIN_VALUE)
 * // => false
 *
 * isLength(Infinity)
 * // => false
 *
 * isLength('3')
 * // => false
 */
function isLength(value) {
  return typeof value === 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}

export default isLength

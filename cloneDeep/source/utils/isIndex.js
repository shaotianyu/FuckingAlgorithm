const MAX_SAFE_INTEGER = 9007199254740991

const reIsUint = /^(?:0|[1-9]\d*)$/

/**
 * 检测value是不是合法的index值
 */
function isIndex(value, length) {
  const type = typeof value
  length = length == null ? MAX_SAFE_INTEGER : length

  return !!length &&
    (type === 'number' ||
      (type !== 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length)
}

export default isIndex

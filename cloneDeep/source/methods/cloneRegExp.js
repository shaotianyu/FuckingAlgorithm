const reFlags = /\w*$/

// 创建RegExp克隆 new RegExp(pattern, attributes)

function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp))
  result.lastIndex = regexp.lastIndex
  return result
}

export default cloneRegExp

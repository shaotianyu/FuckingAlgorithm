// 转换symbol的原始值字符串
const symbolValueOf = Symbol.prototype.valueOf

// 创建symbol克隆对象
function cloneSymbol(symbol) {
  return Object(symbolValueOf.call(symbol))
}

export default cloneSymbol

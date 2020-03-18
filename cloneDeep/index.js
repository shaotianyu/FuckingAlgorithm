import baseClone from './source/baseClone'

/*
  定义两个位掩码常量，通过 & 和 | 运算控制参数类型
  javascript的位运算参考⬇️⬇️⬇️
  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
*/
const CLONE_DEEP_FLAG = 1
const CLONE_SYMBOLS_FLAG = 4


function deepClone(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG)
}

export default deepClone

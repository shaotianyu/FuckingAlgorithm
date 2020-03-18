function initCloneArray(array) {
  const { length } = array
  const result = new array.constructor(length)

  /**
   * 这里考虑了一种特殊的数组情况，那就是regexObj.exec(str)
   * 用来处理匹配正则时，执行exec()的返回结果情况
   * 如果匹配成功，exec() 方法返回一个数组（包含额外的属性 index 和 input）
   * 参考文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
   */
  if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index
    result.input = array.input
  }
  return result
}

export default initCloneArray
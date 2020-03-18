import getSymbolsIn from './getSymbolsIn.js'

/**
 * 返回传入的object 中，所有的实例属性和继承属性，symbol属性 组成的队列
 * 
*/
function getAllKeysIn(object) {
  const result = []
  for (const key in object) {
    result.push(key)
  }
  if (!Array.isArray(object)) {
    result.push(...getSymbolsIn(object))
  }
  return result
}

export default getAllKeysIn

import root from '../common/root'

/**
 * 检测export方法
 */
const freeExports = typeof exports === 'object' && exports !== null && !exports.nodeType && exports

/**
 * 检测module对象
 */
const freeModule = freeExports && typeof module === 'object' && module !== null && !module.nodeType && module

/**
 * 检测CommonJS中的module.exports
 */
const moduleExports = freeModule && freeModule.exports === freeExports

/**
 * 对buffer对象相关的一些引用做处理
 * Buffer.allocUnsafe() 在node中返回指定大小的新未初始化Buffer实例。
 * 参考：https://nodejs.org/api/buffer.html#buffer_buffer_from_buffer_alloc_and_buffer_allocunsafe
 */
const Buffer = moduleExports ? root.Buffer : undefined, allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined

/**
 * 该方法用来clone buffer对象，并返回一个clone后的buffer 对象
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice()
  }
  const length = buffer.length
  const result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length)

  buffer.copy(result)
  return result
}

export default cloneBuffer
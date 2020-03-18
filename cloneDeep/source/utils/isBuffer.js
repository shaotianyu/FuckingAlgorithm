import root from '../common/root'

/**
 * 检测export方法
 */
const freeExports = typeof exports === 'object' && exports !== null && !exports.nodeType && exports

/**
 * 检测module
 */
const freeModule = freeExports && typeof module === 'object' && module !== null && !module.nodeType && module

/**
 * 检测CommonJS中的module.exports
 */
const moduleExports = freeModule && freeModule.exports === freeExports

/**
 * 若条件成立，则使用内置buffer对象
 */
const Buffer = moduleExports ? root.Buffer : undefined

const nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined

/**
 * 检测value是不是buffer对象
 * isBuffer(new Buffer(2)) => true
 * isBuffer(new Uint8Array(2)) => false
 */
const isBuffer = nativeIsBuffer || (() => false)

export default isBuffer
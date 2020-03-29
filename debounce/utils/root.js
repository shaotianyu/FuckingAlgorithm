/**
 * 从Node.js检测可用变量global
 */
const freeGlobal = typeof global === 'object' && global !== null && global.Object === Object && global

/**
 * 检测可用变量globalThis
 */
const freeGlobalThis = typeof globalThis === 'object' && globalThis !== null && globalThis.Object == Object && globalThis

/**
 * 检测变量self
 */
const freeSelf = typeof self === 'object' && self !== null && self.Object === Object && self

/**
 * 定义用作对全局对象的引用
 */
const root = freeGlobalThis || freeGlobal || freeSelf || Function('return this')()

export default root

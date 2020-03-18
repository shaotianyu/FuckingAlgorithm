import freeGlobal from './freeGlobal'

const freeExports = typeof exports === 'object' && exports !== null && !exports.nodeType && exports

const freeModule = freeExports && typeof module === 'object' && module !== null && !module.nodeType && module

const moduleExports = freeModule && freeModule.exports === freeExports

const freeProcess = moduleExports && freeGlobal.process

const nodeTypes = ((() => {
  try {
    // nodejs v10以上版本，启用util.types
    const typesHelper = freeModule && freeModule.require && freeModule.require('util').types
    return typesHelper
      ? typesHelper
      // 如果是nodejs v10之前的版本，使用process.binding('util')
      : freeProcess && freeProcess.binding && freeProcess.binding('util')
  } catch (e) {}
})())

export default nodeTypes

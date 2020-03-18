/** 检测nodejs环境下的global */
const freeGlobal = typeof global === 'object' && global !== null && global.Object === Object && global

export default freeGlobal

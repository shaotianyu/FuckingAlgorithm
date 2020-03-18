import isObject from './utils/isObject'
import isBuffer from './utils/isBuffer'
import isTypedArray from './utils/isTypedArray'
import assignValue from './methods/assignValue'
import getTag from './methods/getTag'
import initCloneArray from './methods/initCloneArray'
import cloneBuffer from './methods/cloneBuffer'
import initCloneObject from './methods/initCloneObject'
import keysIn from './methods/keysIn'
import keys from './methods/keys'
import cloneArrayBuffer from './methods/cloneArrayBuffer'
import cloneDataView from './methods/cloneDataView'
import cloneSymbol from './methods/cloneSymbol'
import getAllKeys from './methods/getAllKeys'
import arrayEach from './methods/arrayEach'
import cloneTypedArray from './methods/cloneTypedArray'
import cloneRegExp from './methods/cloneRegExp'
import Stack from './methods/Stack'
import getAllKeysIn from './methods/getAllKeysIn'

const argsTag = '[object Arguments]'
const arrayTag = '[object Array]'
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const mapTag = '[object Map]'
const numberTag = '[object Number]'
const objectTag = '[object Object]'
const regexpTag = '[object RegExp]'
const setTag = '[object Set]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const weakMapTag = '[object WeakMap]'

const arrayBufferTag = '[object ArrayBuffer]'
const dataViewTag = '[object DataView]'
const float32Tag = '[object Float32Array]'
const float64Tag = '[object Float64Array]'
const int8Tag = '[object Int8Array]'
const int16Tag = '[object Int16Array]'
const int32Tag = '[object Int32Array]'
const uint8Tag = '[object Uint8Array]'
const uint8ClampedTag = '[object Uint8ClampedArray]'
const uint16Tag = '[object Uint16Array]'
const uint32Tag = '[object Uint32Array]'

const cloneableTags = {}
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true
cloneableTags[errorTag] = cloneableTags[weakMapTag] = false

const hasOwnProperty = Object.prototype.hasOwnProperty

const CLONE_DEEP_FLAG = 1
const CLONE_FLAT_FLAG = 2
const CLONE_SYMBOLS_FLAG = 4

function initCloneByTag(object, tag, isDeep) {
  const Ctor = object.constructor
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object)

    case boolTag:
    case dateTag:
      return new Ctor(+object)

    case dataViewTag:
      return cloneDataView(object, isDeep)

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep)

    case mapTag:
      return new Ctor

    case numberTag:
    case stringTag:
      return new Ctor(object)

    case regexpTag:
      return cloneRegExp(object)

    case setTag:
      return new Ctor

    case symbolTag:
      return cloneSymbol(object)
  }
}

function baseClone(value, bitmask, customizer, key, object, stack) {
  let result
  /**
   * 用位运算判断传入的类型
   * 1 | 4 & 1 => 1  
   * 1 | 4 & 2 => 0 
   * 1 | 4 & 4 => 4
   * 所以在当前深拷贝模式下，isDeep 和 isFull为true
   */
  const isDeep = bitmask & CLONE_DEEP_FLAG
  const isFlat = bitmask & CLONE_FLAT_FLAG
  const isFull = bitmask & CLONE_SYMBOLS_FLAG
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value)
  }
  if (result !== undefined) {
    return result
  }
  /**
   * 判断当前递归下value是否为对象，如果不是对象，则直接向上一层返回原值
   * date对象，object，array，typed array（类数组），map,set,array buffers，RegExp 的类型都属于Object
   */
  if (!isObject(value)) {
    return value
  }
  const isArr = Array.isArray(value)
  /**
   * 使用tag记录value类型
   * 返回=>'[object Type]'
   */
  const tag = getTag(value)
  if (isArr) {
    // 数组深拷贝的初始化，返回了一个新数组的雏形
    result = initCloneArray(value)
  } else {
    const isFunc = typeof value === 'function'
    // 判断是否为buffer对象
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep)
    }
    // 如果当前是object/argument/function
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      // 初始化对象克隆
      result = (isFlat || isFunc) ? {} : initCloneObject(value)
    } else {
      if (isFunc || !cloneableTags[tag]) {
        return object ? value : {}
      }
      result = initCloneByTag(value, tag, isDeep)
    }
  }
  // 检查循环引用并返回相应的克隆
  stack || (stack = new Stack)
  const stacked = stack.get(value)
  if (stacked) {
    return stacked
  }
  stack.set(value, result)

  // 当前是map类型
  if (tag == mapTag) {
    value.forEach((subValue, key) => {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack))
    })
    return result
  }
  // 当前是set类型
  if (tag == setTag) {
    value.forEach((subValue) => {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack))
    })
    return result
  }

  // 检测类数组
  if (isTypedArray(value)) {
    return result
  }

  const keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys)

  const props = isArr ? undefined : keysFunc(value)
  // 对数组的内部遍历做了一层逻辑封装
  arrayEach(props || value, (subValue, key) => {
    if (props) {
      key = subValue
      subValue = value[key]
    }
    // 递归进行数据的克隆
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack))
  })
  return result

}

export default baseClone
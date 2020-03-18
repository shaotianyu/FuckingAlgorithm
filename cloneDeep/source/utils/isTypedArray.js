import getTag from '../methods/getTag'
import nodeTypes from '../methods/nodeTypes'
import isObjectLike from './isObjectLike'

/** 匹配类数组的toStringTag */
const reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/

const nodeIsTypedArray = nodeTypes && nodeTypes.isTypedArray

/**
 * 检测是否是类数组
 * isTypedArray(new Uint8Array)
 * // => true
 * isTypedArray([])
 * // => false
 */
const isTypedArray = nodeIsTypedArray
  ? (value) => nodeIsTypedArray(value)
  : (value) => isObjectLike(value) && reTypedTag.test(getTag(value))

export default isTypedArray

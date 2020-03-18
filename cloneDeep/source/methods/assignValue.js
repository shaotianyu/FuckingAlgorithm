import baseAssignValue from './baseAssignValue'
import eq from '../utils/isEq'

const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 如果现有值不相等，则把value 分配给 object 的 key
 */
function assignValue(object, key, value) {
  const objValue = object[key]

  if (!(hasOwnProperty.call(object, key) && eq(objValue, value))) {
    if (value !== 0 || (1 / value) === (1 / objValue)) {
      baseAssignValue(object, key, value)
    }
  } else if (value === undefined && !(key in object)) {
    baseAssignValue(object, key, value)
  }
}

export default assignValue

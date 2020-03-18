/**
 * const object = { 'a': 1 }
 * const other = { 'a': 1 }
 *
 * eq(object, object)
 * // => true
 *
 * eq(object, other)
 * // => false
 *
 * eq('a', 'a')
 * // => true
 *
 * eq('a', Object('a'))
 * // => false
 *
 * eq(NaN, NaN)
 * // => true
 */

 /**
  * (value !== value && other !== other)判断的是NaN的情况，NaN !== NaN
  */
function eq(value, other) {
  return value === other || (value !== value && other !== other)
}

export default eq

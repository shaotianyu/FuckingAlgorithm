import eq from '../utils/isEq'

/**
 获取在键值对的array中找到key位置，若没有则返回-1
  array => [
    [key, value],
    [key, value],
     ...
  ]
 */
function assocIndexOf(array, key) {
  let { length } = array
  while (length--) {
    if (eq(array[length][0], key)) {
      return length
    }
  }
  return -1
}

export default assocIndexOf

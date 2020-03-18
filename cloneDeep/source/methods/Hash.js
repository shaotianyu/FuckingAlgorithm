const HASH_UNDEFINED = '__lodash_hash_undefined__'

class Hash {

  /**
    创建Hash对象,用以键值对存储
   */
  constructor(entries) {
    let index = -1
    const length = entries == null ? 0 : entries.length

    this.clear()
    while (++index < length) {
      const entry = entries[index]
      this.set(entry[0], entry[1])
    }
  }

  clear() {
    this.__data__ = Object.create(null)
    this.size = 0
  }

  /**
   * 删除Hash对象中指定的数据
   */
  delete(key) {
    const result = this.has(key) && delete this.__data__[key]
    this.size -= result ? 1 : 0
    return result
  }

  get(key) {
    const data = this.__data__
    const result = data[key]
    return result === HASH_UNDEFINED ? undefined : result
  }

  has(key) {
    const data = this.__data__
    return data[key] !== undefined
  }

  set(key, value) {
    const data = this.__data__
    this.size += this.has(key) ? 0 : 1
    data[key] = value === undefined ? HASH_UNDEFINED : value
    return this
  }
}

export default Hash

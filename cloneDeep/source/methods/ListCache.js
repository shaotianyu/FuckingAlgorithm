import assocIndexOf from './assocIndexOf'

class ListCache {

  /**
   * 创建ListCache用来缓存对象
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

  /**
   * 清空ListCache
   */
  clear() {
    this.__data__ = []
    this.size = 0
  }

  /**
   * 在ListCache删除指定的key
   */
  delete(key) {
    const data = this.__data__
    const index = assocIndexOf(data, key)

    if (index < 0) {
      return false
    }
    const lastIndex = data.length - 1
    if (index == lastIndex) {
      data.pop()
    } else {
      data.splice(index, 1)
    }
    --this.size
    return true
  }

  /**
   * 在ListCache中获取指定key的数据
   */
  get(key) {
    const data = this.__data__
    const index = assocIndexOf(data, key)
    return index < 0 ? undefined : data[index][1]
  }

  /**
   * 检测对应key的数据是否存在
   */
  has(key) {
    return assocIndexOf(this.__data__, key) > -1
  }

  /**
   * 在ListCache中设定指定的键值对，并返回ListCache的实例对象
   */
  set(key, value) {
    const data = this.__data__
    const index = assocIndexOf(data, key)

    if (index < 0) {
      ++this.size
      data.push([key, value])
    } else {
      data[index][1] = value
    }
    return this
  }
}

export default ListCache

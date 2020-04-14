const queryParse = search => {

  if (!search) {
      return {}
  }

  const result = {}

  const searchArray = search.replace(/^\?/, '').split('&')

  let i = 0

  while (i < searchArray.length) {

    const current = searchArray[i++]
    
    let [key, val] = current.split('=')

    val = decodeURIComponent(val) || ''

    if (key.endsWith('[]')) {
      // 'array[]=1&array[]=2...'
      key = key.replace(/\[\]$/, '')
      if (result[key] === undefined) {
          result[key] = [val]
      } else {
          result[key].push(val)
      }
    }else {
      result[key] = val
    }
    
  }
    
  return result
}

// { ie: 'UTF-8', wd: 'javascript中文文档', array: [ '1', 'n' ] }
queryParse('?ie=UTF-8&wd=javascript%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3&array[]=1&array[]=n')

const queryParse = search => {
  const _search = search.replace(/^\?/, '').split('&')
  return _search.reduce((pre, curr) => {
      const item = curr.split('=')
      pre[item[0]] = decodeURIComponent(item[1])
      return pre
  }, {})
}

export default queryParse
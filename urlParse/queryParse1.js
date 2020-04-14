// URLSearchParams：参考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
const queryParse = search => {
  const searchObj = {};
  for (let [key, value] of new URLSearchParams(search)) {
      searchObj[key] = value;
  }
  return searchObj;
}

export default queryParse
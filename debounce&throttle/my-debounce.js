// 防抖
function debounce(fn, delay=200) {
  let timer = null
  return () => {
    if(timer) {
      clearTimeout(timer)
    }
    const args = arguments
    timer = setTimeout(function(){
      fn.apply(this, args)
    }, delay)
  }
}

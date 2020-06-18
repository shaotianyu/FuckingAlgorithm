// 一般节流
function throttle(fn, interval=200) {
  let last = 0
  return function () {
    let context = this
    let args = arguments
    let now = +new Date()
    if(now - last >= interval) {
      fn.apply(context, args)
      last = now
    }
  }
}

// 优化版节流
// 优化点：用户经常执行大量频繁的操作，而频繁的延迟会让用户很久得不到响应，会产生页面卡死无反应的感觉，
// 优化方案：只要超出了原有的间隔时间，就要给予响应反馈
function throttle(fn, interval=800) {
  let last = 0
  let timer = null
  return function () {
    let context = this
    let args = arguments
    let now = +new Date()
    if(now - last >= interval) {
      last = now
      fn.apply(context, args)
    } else {
      clearTimeout(timer)
      timer = setTimeout(function(){
        last = now
        fn.apply(context, args)
      }, interval)
    }
  }
}

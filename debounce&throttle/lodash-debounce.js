import root from './utils/root'
import isObject from './utils/isObject'

 /**
  func (Function): 要防抖动的函数
  [wait=0] (number): 需要延迟的毫秒数，如果number参数省略，requestAnimationFrame在允许的条件下将被启用
  [options={}] (Object): 选项对象
  [options.leading=false] (boolean): 指定在延迟开始前调用
  [options.maxWait] (number): 设置 func 允许被延迟的最大值
  [options.trailing=true] (boolean): 指定在延迟结束后调用
  */
function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime

  // 最后一次引用的时间
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  /**
   * 当传参中参数wait无设置，则启用requestAnimationFrame，而如果wait设置为0 ，func调用将被推迟到下一个点，类似setTimeout为0的超时
   * tip：根据HTML5 spec 中精确的数值，delay延迟时间大于等于4ms，即便你把delay设为0
   * 具体可见我之前的博客，https://blog.csdn.net/qq_35087256/article/details/80489891
   */
  const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  // 类型强制转换 string -> number,经常用到的还有+new Date()获取时间戳
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    // 在option的maxWait和wait取最大值
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId)
      return root.requestAnimationFrame(pendingFunc)
    }
    return setTimeout(pendingFunc, wait)
  }

  // 清除定时器/动画帧
  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id)
    }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    lastInvokeTime = time
    // 为 trailing edge 触发函数调用设定定时器
    timerId = startTimer(timerExpired, wait)
    // leading = true 执行函数
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // 判断当函数第一次调用的时候，或者间隔时间超出延迟时间wait 或者系统时间变更，或者超出设定的maxWait
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    // shouldInvoke中判断了每次事件触发的时间差，判断是否大于限定的阈值
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    // 函数被调用的时间
    lastCallTime = time

    if (isInvoking) {
      // 无timerId的情况有两种：1.首次调用 2.trailingEdge执行过函数
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce

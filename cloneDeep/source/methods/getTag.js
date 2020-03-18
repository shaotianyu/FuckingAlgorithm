const toString = Object.prototype.toString

/**
 * 为了每个对象都能通过 Object.prototype.toString() 来检测，
 * 需要以 Function.prototype.call() 或者 Function.prototype.apply() 的形式来调用，
 * 传递要检查的对象作为第一个参数，称为 thisArg。
 *  var toString = Object.prototype.toString;
 *  toString.call(new Date); // [object Date]
 *  toString.call(new String); // [object String]
 *  toString.call(Math); // [object Math]
 *  //Since JavaScript 1.8.5
 *  toString.call(undefined); // [object Undefined]
 *  toString.call(null); // [object Null]
 *  toString.call(argument); // [object Arguments]
 */
function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

export default getTag

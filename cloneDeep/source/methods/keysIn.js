/**
 * 返回对象的继承属性和实例属性
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  const result = []
  for (const key in object) {
    result.push(key)
  }
  return result
}

export default keysIn


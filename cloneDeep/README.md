
### 一、概要

工具库 [lodash](https://github.com/lodash/lodash) 在开发过程中为我们封装了丰富便捷的js函数，实现一些常用的功能，在使用过程中就会对lodash的内部实现原理感到好奇。

本次文章的主要内容分析阅读了lodash中深拷贝 ```_.cloneDeep（）```的实现。

### 二、深拷贝和浅拷贝之间的区别

浅拷贝：对于引用类型的数据来说，赋值运算只是更改了引用的指针，但是指针指向的地址还是同一个，所以对应的变动会影响双方。

深拷贝：递归拷贝一个对象中的字对象，完成后两个对象不互相影响。

### 三、什么样的数据在深拷贝适用范围

包括但不限于：

* Date对象
* Object
* Array
* TypedArray
* Map
* Set
* ArrayBuffer
* RegExp

### 四、lodash如何实现深拷贝

#### 1、初始化

```js
const CLONE_DEEP_FLAG = 1
const CLONE_SYMBOLS_FLAG = 4

function deepClone(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG)
}
```
`cloneDeep`的主体函数`baseClone`:
```
function baseClone(value, bitmask, customizer, key, object, stack) {
  let result
  const isDeep = bitmask & CLONE_DEEP_FLAG
  const isFlat = bitmask & CLONE_FLAT_FLAG
  const isFull = bitmask & CLONE_SYMBOLS_FLAG
}
```
以上入口代码看起来很简洁：定义两个位掩码常量，通过位运算控制参数类型，达到控制参数权限的基本实现:
```js
1 | 4 & 1 => 1  
1 | 4 & 2 => 0 
1 | 4 & 4 => 4
```
由上面的位元算可得知，在当前深拷贝模式下，`isDeep` 和 `isFull`为`true`，这两个变量在下面的代码中起到很大的判断作用。

关于javascript中位运算可以参考MDN：[Bitwise_Operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)。

#### 2、标记值的类型
```js
const tag = getTag(value)
```
```js
const toString = Object.prototype.toString

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}
```
以上实现通过调用`Object`的原型`toString()`方法，区别不同`value`对应的具体类型：
```js
 var toString = Object.prototype.toString;
 toString.call(new Date); // [object Date]
 toString.call(new String); // [object String]
 toString.call(Math); // [object Math]
 //JavaScript版本1.8.5 及以上
 toString.call(undefined); // [object Undefined]
 toString.call(null); // [object Null]
 toString.call(argument); // [object Arguments]
```

#### 3、数组的拷贝

```js
if (isArr) {
    // 数组深拷贝的初始化，返回了一个新数组的雏形
    result = initCloneArray(value)
} 
```
```js
function initCloneArray(array) {
  const { length } = array
  const result = new array.constructor(length)
  
  if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index
    result.input = array.input
  }
  return result
}

export default initCloneArray 
```

看到这里会有疑问，为什么数组类型的拷贝，需要判断`typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')`？`index`和`input`是什么情况?

熟悉js正则匹配的会知道，这里考虑了一种特殊的数组情况，那就是`regexObj.exec(str)`，用来处理匹配正则时，执行`exec()`的返回结果情况，如果匹配成功，`exec() `方法返回一个数组（包含额外的属性 `index` 和 `input`）

```js
const matches = /(hello \S+)/.exec('hello world, javascript');
console.log(matches);
输出=>
[
    0: "hello world,"
    1: "hello world,"
    index: 0
    input: "hello world, javascript"
    groups: undefined
    length: 2
]
```

#### 4、Buffer的拷贝

```js
if (isBuffer(value)) {
  return cloneBuffer(value, isDeep)
}
```

```js
const Buffer = moduleExports ? root.Buffer : undefined, allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined

function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice()
  }
  const length = buffer.length
  const result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length)

  buffer.copy(result)
  return result
}
```
以上对buffer对象相关的一些引用做处理。Buffer.allocUnsafe() 在node中返回指定大小的新未初始化Buffer实例。

具体可以参考：[Buffer.allocUnsafe](https://nodejs.org/api/buffer.html#buffer_buffer_from_buffer_alloc_and_buffer_allocunsafe)。

**5、Object的拷贝**

Object的拷贝开始，会使用`Object.create()`构造出一个空对象，用以实现原对象的原型继承。


```js
// 用来检测value是否为原型对象
function isPrototype(value) {
  const Ctor = value && value.constructor
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

  return value === proto
}

function initCloneObject(object) {
  return (typeof object.constructor === 'function' && !isPrototype(object))
    ? Object.create(Object.getPrototypeOf(object))
    : {}
}

```

##### 4.1、使用栈来维护对象的拷贝


```js
stack || (stack = new Stack)
const stacked = stack.get(value)
if (stacked) {
return stacked
}
// 这里的result是上面一系列代码生成的初始化对象，可以暂时把它理解为一个包含原型继承关系的空对象
stack.set(value, result)
```

上面代码建立了`Stack`，这是个数据管理接口，其内部详细的缓存行为大概细分为HashCache、MapCache和ListCache，为什么使用三种缓存方式，这三种方式做了一个降级处理，优先使用级：`HashCache > MapCache > ListCache`,在较大的数据量时，对象的存取性能会依次降低。


```js
const loopObject = { a: 1 }
loopObject.b = loopObject
```
🌰中，`loopObject`中的`b`就是一个循环引用的属性。

由于这个特殊情况的存在，在使用`JSON.parse(JSON.stringify(loopObject))`时会出现内存溢出的问题。


使用缓存的另一个好处是，能够处理对象中循环引用的情况。在遍历到循环引用对象时，缓存策略会从`ceche`中利用对应的`key`找出对应的`value`，如果对应的引用已经拷贝了，就不需要在再次执行拷贝了

#### 5、递归拷贝


```js
if (tag == mapTag) {
    value.forEach((subValue, key) => {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack))
    })
    return result
}
// 当前是set类型
if (tag == setTag) {
    value.forEach((subValue) => {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack))
    })
    return result
}

// 其他的可迭代对象，比如Array/Object
arrayEach(props || value, (subValue, key) => {
    if (props) {
      key = subValue
      subValue = value[key]
    }
    // 递归进行数据的克隆
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack))
})
```
字对象的递归拷贝主要递归使用了`baseClone()`，并对不同类型的对象作区分。

### 五、小结

以上是对`lodash`的深拷贝做了一个大概流程的分析，并没有具体到每一个函数实现，特别是`Stack`中几种缓存结构的深入解析，以后会持续更新HashCache、MapCache和ListCache相关内容。

🦉🦉🦉




**---------------NO WAN---------------**

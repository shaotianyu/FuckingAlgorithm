
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

##### 4.1、使用数据缓存来维护对象的拷贝


```js
stack || (stack = new Stack)
const stacked = stack.get(value)
if (stacked) {
return stacked
}
// 这里的result是上面一系列代码生成的初始化对象，可以暂时把它理解为一个包含原型继承关系的空对象
stack.set(value, result)
```
上面代码建立了`Stack`，这是个数据管理接口，将子对象的值作为`key-value`一对一的形式缓存起来，其内部详细的缓存行为大概细分为`HashCache`、`MapCache`和`ListCache`，为什么使用三种对象缓存策略？

`HashCache`本质上是用对象的存储方式，可是会有个限制，`js`中的对象存储，本质上是键值对的集合（Hash 结构），只能限制使用`字符串/Symbol`当作键，这给它的使用带来了很大的限制。而`Map`提供了一种更完善的 `Hash `结构实现，它的`key`可以是各种类型，所以在`key`为`Object/Array`等类型的场景下，lodash内部使用了`MapCache`。

###### 4.1.1、Stack

```js
class Stack{
    ...
    const LARGE_ARRAY_SIZE = 200
    // Stack的set方法
    set(key, value) {
        let data = this.__data__
        if (data instanceof ListCache) {
          const pairs = data.__data__
          if (pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value])
            this.size = ++data.size
            return this
          }
          data = this.__data__ = new MapCache(pairs)
        }
        data.set(key, value)
        this.size = data.size
        return this
    }
    ...
}
```
由`Stack`的入口逻辑可以看到，当缓存内部`__data__`的长度超出`LARGE_ARRAY_SIZE`限额时，构造了`MapCache`的实例，并采用了`MapCache`的内部`set`方法，否则使用`ListCache`。

###### 4.1.2、LstCache

`ListCache`其实是一个二维数组类型的数据结构

```js
class ListCache {
    ...
    // ListCache中set方法，实现了二维数组式存储
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
    ...
}
```

###### 4.1.3、MapCache

下面是`MapCache`的存储主要实现：

```js
// 初始化数据结构
this.__data__ = {
  'hash': new Hash,
  'map': new Map,
  'string': new Hash
}

set(key, value) {
    const data = getMapData(this, key)
    const size = data.size
    data.set(key, value)
    this.size += data.size == size ? 0 : 1
    return this
}

// 根据key的类型来判断该数据的存储方式，Hash或者Map
function getMapData({ __data__ }, key) {
  const data = __data__
  return isKeyable(key)
    ? data[typeof key === 'string' ? 'string' : 'hash']
    : data.map
}

// 检查 value 是否适合用作唯一对象键
function isKeyable(value) {
  const type = typeof value
  return (type === 'string' || type === 'number' || type === 'symbol' || type === 'boolean')
    ? (value !== '__proto__')
    : (value === null)
}
```

###### 4.1.4、HashCache

有下面的代码可以看出，`Hash` 其实是用对象形式做缓存


```js
const HASH_UNDEFINED = '__lodash_hash_undefined__'

this.__data__ = Object.create(null)

set(key, value) {
    const data = this.__data__
    this.size += this.has(key) ? 0 : 1
    data[key] = value === undefined ? HASH_UNDEFINED : value
    return this
}
```


##### 4.2、循环引用问题

```js
const loopObject = { a: 1 }
loopObject.b = loopObject
```
🌰中，`loopObject`中的`b`就是一个循环引用的属性。

由于这个特殊情况的存在，在使用`JSON.parse(JSON.stringify(loopObject))`时会出现内存溢出的问题。


使用缓存的另一个好处是，能够处理对象中循环引用的情况。在遍历到循环引用对象时，缓存策略会从`ceche`中利用对应的`key`找出对应的`value`，如果对应的引用已经拷贝了，就不需要在再次执行拷贝了，避免了溢出的问题。

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

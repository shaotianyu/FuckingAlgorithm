class Node {
  constructor (element) {
    this.element = element
    this.next = null
    this.prev = null
  }
}

class DoubleLinkedList {

  constructor () {
    this.length = 0
    this.head = null
    // 定义尾部节点
    this.tail = null
  }

  append (element) {
    let node = new Node(element)
    let tail = this.tail
    if (this.head === null) {
      this.head = node
      this.tail = node
    } else {
      tail.next = node
      node.prev = tail
      this.tail = node
    }
    this.length++
  }

  insert (element, point) {
    if(point >= 0 && point <= this.length) {
      let node = new Node(element)
      let current = this.head
      let tail = this.tail
      let index = 0
      let previous
      if (point === 0) {
        if (!this.head) {
          this.head = node
          this.tail = node
        } else {
          node.next = current
          current.prev = node
          this.head = node
        }
      } else if (point === this.length) {
        current = tail
        current.next = node
        node.prev = current
        this.tail = node
      } else {
        while (index++ < point) {
          previous = current
          current = current.next
        }
        // 将原来的链表断开，重新使用指针串接起来
        node.next = current
        node.prev = previous
        previous.next = node
        current.prev = node
      }
      this.length++
      return true
    } else {
      return false
    }
  }

  removeAt (point) {
    if (point > -1 && point < this.length) {
      let current = this.head
      let index = 0
      let previous
      let tail = this.tail
      if (point === 0) {
        // remove第一项的情况
        this.head = current.next
        if (this.length === 1) {
          this.tail = null
        } else {
          this.head.prev = null
        }
      } else if (point === this.length -1) {
        current = tail
        this.tail = current.prev
        this.tail.next = null
      } else {
        while (index++ < point) {
          previous = current
          current = current.next
        }
        previous.next = current.next
        current.next.prev = previous
      }
      this.length--
      return current.element
    } else {
      return null
    }
  }

  find (element) {
    let current = this.head
    let index = 0
    if (element == current.element){
        return 0;
    }
    while (current.next) {
      if(current.element === element) {
        return index
      }
      index++
      current = current.next
    }
    // 为了保证最后一位被找到
    if (element == current.element){
        return index;
    }
    return -1
  }

  remove (element) {
    let index = this.find(element)
    return this.removeAt(index)
  }

  isEmpty () {
    return this.length === 0
  }

  size () {
    return this.length
  }

  print () {
    let current = this.head
    let result = ''
    while (current) {
      result += current.element + (current.next ? '->' : '')
      current = current.next
    }
    return result
  }

}

let l1 = new DoubleLinkedList()
l1.append('element1')
l1.append('element2')
l1.append('element3')
l1.append('element4')

l1.insert('elementnew', 3)


console.log(l1.removeAt(10), 'removeAt');

console.log(l1.find('element4'));

console.log(l1.remove('element4'));

console.log(l1.print());

console.log(l1);
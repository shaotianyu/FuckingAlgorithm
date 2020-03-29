class Node {
  constructor (element) {
    this.element = element
    this.next = null
  }
}

class CircleLinkedList {

  constructor () {
    // 初始化链表长度
    this.length = 0
    // 初始化链表第一个节点
    this.head = null
  }

  append (element) {
    let node = new Node(element)
    let head = this.head
    let current
    // 链表为空情况
    if (this.head === null) {
      this.head = node
    } else {
      current = this.head
      while (current.next && current.next !== head) {
        current = current.next
      } 
      current.next = node
    }
    // 保持首尾相连
    node.next = head
    this.length ++
  }

  insert (element, point) {
    if (point >=0 && point <= this.length) {
      let node = new Node(element)
      let current = this.head
      let previous
      let index = 0
      if (point === 0) {
        node.next = current
        while (current.next && current.next !== this.head) {
          current = current.next
        }
        this.head = node
        current.next = this.head
      } else {
        while (index++ < point) {
          previous = current
          current = current.next
        }
        previous.next = node
        // 首尾相连
        node.next = current === null ? head : current
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
      if (point === 0) {
        this.head = current.next
        while (current.next && current.next !== this.head) {
          current = current.next
        }
        current.next = this.head
      } else {
        while (index++ < point) {
          previous = current
          current = current.next
        }
        previous.next = current.next
      }
      this.length--
      return current.element
    } else {
      return null
    }
  }

  remove (element) {
    let index = this.find(element)
    // 删除后返回已删除的节点
    return this.removeAt(index)
  }

  find (element) {
    let current = this.head
    let index = 0
    if (element == current.element){
        return 0;
    }
    while (current.next && current.next !== this.head) {
      if(current.element === element) {
        return index
      }
      index++
      current = current.next
    }
    if (element == current.element){
        return index;
    }
    return -1
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
    while (current.next && current.next !== this.head) {
      result += current.element + (current.next ? '->' : '')
      current = current.next
    }
    result += current.element
    return result
  }
}

let l1 = new CircleLinkedList()

l1.append('element1')
l1.append('element2')
l1.append('element3')
l1.append('element4')

l1.insert('elementprev', 0)

l1.insert('elementlast', 3)

// console.log(l1.removeAt(0), 'l1.removeAt(0)');
// console.log(l1.removeAt(2), 'l1.removeAt(2)');

// console.log(l1.find('element'));

console.log(l1.print());

console.log(l1);
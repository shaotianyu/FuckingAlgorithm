class Node {
  constructor (element) {
    this.element = element
    this.next = null
  }
}

class LinkedList {

  constructor () {
    // 初始化链表长度
    this.length = 0
    // 初始化链表第一个节点
    this.head = null
  }

  append (element) {
    let node = new Node(element)
    let current
    // 链表为空情况
    if (this.head === null) {
      this.head = node
    } else {
      current = this.head
      while (current.next) {
        current = current.next
      } 
      current.next = node
    }
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
        this.head = node
      } else {
        while (index++ < point) {
          previous = current
          current = current.next
        }
        previous.next = node
        node.next = current
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
    while (current.next) {
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
    while (current) {
      result += current.element + (current.next ? '->' : '')
      current = current.next
    }
    return result
  }
}

let l1 = new LinkedList()

l1.append('element1')
l1.append('element2')
l1.append('element4')
l1.append('element5')
l1.append('element6')
l1.append('element7')
l1.append('element8')

l1.insert('element3', 2)

console.log(l1.removeAt(0), 'l1.removeAt(0)');

console.log(l1.find('element8'))
console.log(l1.remove('element2'))
console.log(l1.print());
// 克隆arrayBuffer
function cloneArrayBuffer(arrayBuffer) {
  const result = new arrayBuffer.constructor(arrayBuffer.byteLength)
  new Uint8Array(result).set(new Uint8Array(arrayBuffer))
  return result
}

export default cloneArrayBuffer

import cloneArrayBuffer from './cloneArrayBuffer'

// 创建dataView克隆对象
function cloneDataView(dataView, isDeep) {
  const buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength)
}

export default cloneDataView

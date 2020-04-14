import queryParse from './queryParse1'

// 适用DOM环境

// HTMLAnchorElement：参考 https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLAnchorElement

const urlParse = url => {

  const anchorElement = document.createElement('a')

  anchorElement.href = url

  return {
      // URLUtils.username 访问资源使用的用户名，不可见
      username: anchorElement.username,
      password: anchorElement.password,
      // 常用参数
      hostname: anchorElement.hostname,
      port: anchorElement.port,
      pathname: anchorElement.pathname,
      search: queryParse(anchorElement.search),
      hash: anchorElement.hash,
      protocol: anchorElement.protocol
  }

}

urlParse('https://www.baidu.com/s?ie=UTF-8&wd=javascript%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3')
/**
{
  username: ""
  password: ""
  hostname: "www.baidu.com"
  port: ""
  pathname: "/s"
  search: {ie: "UTF-8", wd: "javascript中文文档"}
  hash: ""
  protocol: "https:"
}
 */

export default urlParse
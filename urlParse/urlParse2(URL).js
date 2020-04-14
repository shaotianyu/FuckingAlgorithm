import queryParse from './queryParse2'


// Web Worker/NodeJs环境下适用

// 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL

const urlParse = url => {

  const urler = new URL(url)

  return {
      // URLUtils.username 访问资源使用的用户名，不可见
      username: urler.username,
      password: urler.password,
      hostname: urler.hostname,
      port: urler.port,
      pathname: urler.pathname,
      search: queryParse(urler.search),
      hash: urler.hash,
      protocol: urler.protocol
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
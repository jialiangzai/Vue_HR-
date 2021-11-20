const Koa = require('koa')
const serve = require('koa-static')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const proxy = require('koa2-proxy-middleware')
// 这句话 的意思是除接口之外所有的请求都发送给了 index.html
const app = new Koa()
app.use(proxy({
  targets: {
    // (.*) means anything
    '/prod-api/(.*)': {
      target: 'http://8.142.65.7:3000', //后端服务器地址
      changeOrigin: true,
      pathRewrite: {
        // 这里之所以用了pathRewrite，是因为生产环境的请求基础地址是 /prod-api，需要将该地址替换成真实后台前缀/api
        '/prod-api': "/api"
      }
    }
  }
}))
app.use(historyApiFallback({
  whiteList: ['/prod-api'] // 这里的whiteList是 白名单的意思
}))
app.use(serve(__dirname + "/public")) //将public作为对外静态资源访问目录
app.listen(3658, () => {
  console.log(`人资项目启动成功：http://localhost:3658`)
})
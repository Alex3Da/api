// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 数据验证模块
const Joi = require('joi')

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors());

//配置解析application/x-www-form-urlencoded格式的表单数据的中间件
app.use(express.urlencoded({extended: false}))

//配置解析application/json格式的表单数据的中间件
app.use(express.json())


// 托管静态文件
app.use('/uploads', express.static('./uploads'))


// 在路由之前封装res.cc函数
app.use((req, res, next) => {
    res.cc = function (err, code = 1) {
        res.send({
            code,
            message: err instanceof Error ? err.message : err,
        })
    }
    // 传递给下一个中间件
    next()
})


// 解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
// 不需要验证 api uploads 正则解释  匹配 以/开头的api/或者uploads/
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api\/|^\/uploads/]}))


// 路由

// 导入并使用用户路由模块
const userRouter = require('./router/user') // 封装路由模块
app.use('/api', userRouter)

// 导入并使用用户信息基本模块
const userInfoRouter = require('./router/userinfo')
app.use('/my', userInfoRouter)


// 导入并使用分类模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)


// 导入并使用文章模块
const articlesRouter = require('./router/articles')
app.use('/my/article', articlesRouter)


// 定义全局错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof Joi.ValidationError) return res.cc(err.message)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    res.cc(err.message)
})


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})
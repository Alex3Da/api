// 导入模块并创建路由对象
const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 导入数据验证中间件
const expressJoi = require('@escook/express-joi') // 执行验证规则

// 导入需要验证的对象
const {reg_login_schema} = require('../schema/user')
// 对象解构赋值 只取reg_login_schema这个对象属性



// 注册
router.post('/reguser',expressJoi(reg_login_schema),userHandler.regUser)

// 登录
router.post('/login',expressJoi(reg_login_schema),userHandler.login)

// 将路由对象共享出去
module.exports = router
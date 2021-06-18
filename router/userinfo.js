// 导入模块并创建路由对象
const express = require('express')
const router = express.Router()

// 导入处理函数模块
const userinfo_handler = require('../router_handler/userinfo')


// 导入数据验证的中间件
const  expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const {update_userinfo_schema} = require('../schema/user')
const {update_password_schema} = require('../schema/user')
const {update_avatar_schema} = require('../schema/user')

// 挂载路由

// 获取用户信息的基本路由
router.get('/userinfo',userinfo_handler.getUserInfo)

// 更改用户信息的路由
router.put('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)

// 更改密码路由
router.patch('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)

// 更新头像路由
router.patch('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)


router.get('/getAvatar',userinfo_handler.getAvatar)






module.exports = router
/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body

    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, result) => {  // 参数名字不要变
        if (err) return res.cc(err)
        console.log(result)
        if (result.length > 0) return res.cc('用户名已经被占用,请更换其他用户名')

        // 调用bcrypt.hashSync对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 注册账户
        const insert_sql = 'insert into ev_users set ?'
        db.query(insert_sql, {username: userinfo.username, password: userinfo.password}, (err, result) => {
            // 判断sql是否执行成功
            if (err) return res.cc(err)
            // 判断影响行数是否为1
            if (result.affectedRows !== 1) return res.cc('注册失败,请稍后再试')
            res.cc('注册成功', 0)

        })

    })

}

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body

    // 定义sql语句
    const sql = `select * from ev_users where username=?`
    db.query(sql, userinfo.username, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length !== 1) return res.cc('账号不存在...')


        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
        if (!compareResult) return res.cc('密码错误')


        // 导入配置模块
        const user = {...result[0], password: '', user_pic: '',avatar:''} // 解构赋值

        const config = require('../config')
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        res.send({
            code: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })


}
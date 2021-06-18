// 导入处理密码模块
const bcrypt = require('bcryptjs')
const db = require('../db/index')


// 获取用户基本信息
exports.getUserInfo = (req, res) => {
    const sql = `select id,username,nickname,email,avatar from ev_users where id=?`

    db.query(sql, req.user.id, (err, results) => {
        //  express-jwt中间件配置成功后  使用 req.user 对象，来访问从 JWT 字符串中解析出来的用户信息
        if (err) return res.cc(err.message)
        if (results.length !== 1) return res.cc('获取用户信息失败')
        res.send({
            code: 0,
            message: '获取用户信息成功',
            data: results[0]

        })
    })

}

// 更新用户信息处理函数
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id=?`
    // 执行sql
    db.query(sql, [req.body, req.body.id], (err, result) => {
        if (err) return res.cc(err.message)
        if (result.affectedRows !== 1) return res.cc('该用户不存在')

        res.cc('更新用户信息成功', 0)
    })

}

// 更改用户密码
exports.updatePassword = (req, res) => {
    // 根据id查询用户是否存在
    const sql = `select * from ev_users where id=?`
    db.query(sql, req.user.id, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length !== 1) return res.cc('用户不存在')

        const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
        if (!compareResult) return res.cc('旧密码错误')

        // 开始更新密码
        const update_sql = `update ev_users set password=? where id=?`
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(update_sql, [newPwd, req.user.id], (err, result) => {
            if (err) return res.cc(err.message)
            if (result.affectedRows !== 1) return res.cc('更新密码失败')
            res.cc('更新密码成功', 0)

        })

    })

}


// 更改头像
exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set avatar=? where id=?`
    db.query(sql, [req.body.avatar, req.user.id], (err, result) => {
        if (err) return res.cc(err.message)
        if (result.affectedRows !== 1) return res.cc('更换头像失败')
        res.cc('更换头像成功', 0)
    })
}

// 获取头像
exports.getAvatar = (req, res) => {
    const sql = `select avatar from ev_users where id=?`
    db.query(sql,req.user.id, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length !== 1) return res.cc('获取头像失败')
        res.send({
            code:0,
            message:'获取头像成功',
            data:result
        })
    })
}

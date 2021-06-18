//路由处理函数模块

// 导入数据库模块
const db = require('../db/index')


// 获取分类列表的处理函数
exports.getArtCates = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    db.query(sql, (err, result) => {
        if (err) return res.cc(err.message)
        res.send({
            code: 0,
            message: '获取分类成功',
            data: result
        })

    })

}

// 添加文章分类
exports.addArtCates = (req, res) => {

    const sql = `select * from ev_article_cate where (name=? or alias=?) and is_delete=0`
    db.query(sql, [req.body.name, req.body.alias], (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length === 2) return res.cc('分类名称与分类别名都被占用,请更换重试') // 两条记录都满足条件
        if (result.length === 1 && result[0].name === req.body.name && result[0].alias === req.body.alias) return res.cc('分类名称与分类别名都被占用,请更换重试')
        // 同一条记录满足两个条件 也等于1
        if (result.length === 1 && result[0].name === req.body.name) return res.cc('分类名称被占用,请更换重试')
        if (result.length === 1 && result[0].alias === req.body.alias) return res.cc('分类别名被占用,请更换重试')

        const insert_sql = `insert into ev_article_cate set ?`
        db.query(insert_sql, req.body, (err, result) => {
            if (err) return res.cc(err.message)
            if (result.affectedRows !== 1) return res.cc('插入分类失败')
            res.cc('插入分类成功', 0)
        })

    })
}


// 删除分类
exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=? and is_delete=0`
    db.query(sql, req.params.id, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.affectedRows !== 1) return res.cc('分类不存在')
        res.cc('删除分类成功', 0)

    })
}


// 根据id获取分类
exports.getArtCateById = (req, res) => {
    const sql = `select * from ev_article_cate where id=? and is_delete=0`
    db.query(sql, req.params.id, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length !== 1) return res.cc('分类不存在')
        res.send({
            code: 0,
            message: '获取分类成功',
            data: result[0]
        })

    })
}


// 更新分类
exports.updateCateById = (req, res) => {
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?) and is_delete=0`
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length === 2) return res.cc('分类名称与分类别名都被占用,请更换重试') // 两条记录都满足条件
        if (result.length === 1 && result[0].name === req.body.name && result[0].alias === req.body.alias) return res.cc('分类名称与分类别名都被占用,请更换重试')
        // 同一条记录满足两个条件 也等于1
        if (result.length === 1 && result[0].name === req.body.name) return res.cc('分类名称被占用,请更换重试')
        if (result.length === 1 && result[0].alias === req.body.alias) return res.cc('分类别名被占用,请更换重试')

        const update_sql = `update ev_article_cate set ? where Id=? and is_delete=0`
        db.query(update_sql, [req.body, req.body.id], (err, result) => {
            if (err) return res.cc(err.message) // 这里只报语句是否正常执行
            if (result.affectedRows !== 1) return res.cc('更新失败')
            res.cc('更新成功', 0)
        })

    })
}

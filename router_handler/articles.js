//路由处理函数模块

// 导入数据库模块
const db = require('../db/index')
const path = require('path')
const fs = require('fs')


// 添加文章列表的处理函数
exports.addArticle = (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数!')

    // 拼接后缀
    let oldname = req.file.path
    let newname = req.file.path + path.parse(req.file.originalname).ext //.jpg
    fs.renameSync(oldname, newname)//将老的文件名改成新的有后缀的文件 #同步写法
    // 处理文章的信息对象
    const articleInfo = {
        ...req.body,
        cover_img: '/uploads/'+path.basename(newname),
        pub_date: new Date().getTime(),
        author_id: req.user.id,
    }

    // 发布文章
    const sql = `insert into ev_articles set ?`
    db.query(sql, articleInfo, (err, result) => {
        if (result.affectedRows !== 1) return res.cc('发布文章失败')
        if (err) return res.cc(err.message)
        res.cc('发布文章成功', 0)
    })

}

// 获取文章列表
exports.getArticle = (req, res) => {
    let total = ''

    const  cate_id = req.query.cate_id===''?'cate_id':'cate_id='+req.query.cate_id
    const  state = req.query.state===''?'':`and state='${req.query.state}'`

    // 这里可以优化成一条sql语句
    const sql = `select  t1.*,t2.name,t3.username,t3.nickname from ev_articles as t1 join ev_article_cate as t2 on t1.cate_id=t2.id join ev_users as t3 on t1.author_id=t3.id where t1.is_delete=0  and ${cate_id} ${state}  limit ?,?`
    const sum_sql = `select  t1.*  from ev_articles as t1 join ev_article_cate as t2 on t1.cate_id=t2.id join ev_users as t3 on t1.author_id=t3.id where t1.is_delete=0  and ${cate_id} ${state}`


    db.query(sum_sql, (err,result) => {
        total = result.length
    })

    const pagenum = parseInt(req.query.pagenum)*parseInt(req.query.pagesize)-parseInt(req.query.pagesize)
    const pagesize = parseInt(req.query.pagesize)

    db.query(sql,[pagenum,pagesize], (err,result) => {
        if (err) return res.cc(err.message)
        res.send({
            code: 0,
            message: '获取文章分类成功',
            data: result,
            total:total
        })

    })
}

// 删除文章
exports.deleteArticle = (req, res) => {
    const sql = `update ev_articles set is_delete=1 where id=? and is_delete=0`
    db.query(sql, req.params.id, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.affectedRows !== 1) return res.cc('文章不存在...')
        res.cc('删除文章成功', 0)
    })
}


// 根据ID获取文章详情
exports.getArticleById = (req, res) => {
    const sql = `select * from ev_articles where id=? and is_delete=0`
    db.query(sql, req.params.id, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length !== 1) return res.cc('文章不存在')
        res.send({
            code: 0,
            message: '获取文章成功',
            data: result[0]
        })

    })
}


// 更新文章
exports.updateArticleById = (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数!')

    // 拼接后缀
    let oldname = req.file.path
    let newname = req.file.path + path.parse(req.file.originalname).ext //.jpg
    fs.renameSync(oldname, newname)//将老的文件名改成新的有后缀的文件 #同步写法
    // 处理文章的信息对象
    const articleInfo = {
        ...req.body,
        cover_img: '/uploads/'+path.basename(newname),
        pub_date: new Date().getTime(),
        author_id: req.user.id,
    }

    // 更新文章
    const sql = `update ev_articles set ? where Id=? and is_delete=0`
    db.query(sql, [articleInfo, req.body.id], (err, result) => {
        if (result.affectedRows !== 1) return res.cc('文章不存在...')
        if (err) return res.cc(err.message)
        res.cc('更新文章成功', 0)
    })

}

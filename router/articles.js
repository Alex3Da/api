// 导入模块
const express = require('express')
const router = express.Router()


// 导入处理函数模块
const articleHandler = require('../router_handler/articles')


// 导入multer和path
const multer = require('multer')
const path = require('path')


// 导入数据验证的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const {add_article_schema} = require('../schema/articles')
const {delete_article_schema} = require('../schema/articles')
const {get_article_schema} = require('../schema/articles')
const {update_article_schema} = require('../schema/articles')


// 创建multer的实例
const uploads = multer({dest: path.join(__dirname, '../uploads')})
console.log(path.join(__dirname, '../uploads'))

// 添加文章
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), articleHandler.addArticle)


// 查看文章列表
router.get('/list', articleHandler.getArticle)


// 删除文章
router.delete('/delete/:id', expressJoi(delete_article_schema), articleHandler.deleteArticle)

// 获取文章详情
router.get('/:id', expressJoi(get_article_schema), articleHandler.getArticleById)

// 更新文章
router.put('/edit', uploads.single('cover_img'), expressJoi(update_article_schema), articleHandler.updateArticleById)


module.exports = router

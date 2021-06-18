// 导入模块
const express = require('express')
const router = express.Router()

// 导入处理函数模块
const artCateHandler = require('../router_handler/artcate')


// 导入数据验证的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const {add_cate_schema} = require('../schema/artcate')
const {delete_cate_schema} = require('../schema/artcate')
const {get_cate_schema} = require('../schema/artcate')
const {update_cate_schema} = require('../schema/artcate')


// 获取分类列表
router.get('/cates', artCateHandler.getArtCates)

// 添加文章分类
router.post('/addcates', expressJoi(add_cate_schema), artCateHandler.addArtCates)

//删除分类
router.delete('/deletecate/:id', expressJoi(delete_cate_schema), artCateHandler.deleteCateById)


// 根据id获取分类
router.get('/cates/:id', expressJoi(get_cate_schema), artCateHandler.getArtCateById)

// 更新分类
router.put('/updatecate', expressJoi(update_cate_schema), artCateHandler.updateCateById)


module.exports = router

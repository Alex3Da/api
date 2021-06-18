// 导入定义规则的包
const joi = require('joi')

// 定义字段验证规则
const id = joi.number().integer().min(1).required()
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()


// 定义添加分类的规则对象
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state

    }
}

// 定义删除文章的规则对象
exports.delete_article_schema = {
    params: {
        id
    }
}

// 根据Id获取文章的规则对象
exports.get_article_schema = {
    params: {
        id
    }
}


// 更新文章的规则对象
exports.update_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state
    }
}
// 导入定义规则的包
const joi = require('joi')


const id = joi.number().integer().min(1).required()
const name = joi.string().required()
const alias = joi.string().alphanum().required()


// 定义添加分类的规则对象
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 定义删除分类的规则对象
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 定义根据Id获取分类的规则对象
exports.get_cate_schema = {
    params: {
        id
    }
}

// 定义根据Id更新分类的规则对象
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}

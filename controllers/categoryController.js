// import model
const Category = require('../models/categoryModel')

exports.testFunction = (req, res) => {
    res.status(200).json({ message: 'this is a success message' })
}

// to post category

exports.postCategory = async (req, res) => {
    let category = new Category({
        category_name: req.body.category_name
    })
    Category.findOne({ category_name: category.category_name }, async (error, data) => {
        if (data == null) {
            category = await category.save()
            if (!category) {
                return res.status(400).json({ error: 'something went wrong' })
            }
            res.send(category)
        }
        else {
            return res.status(400).json({ error: 'category must be unique' })
        }
    })
}


// list all the category
exports.categoryList = async (req, res) => {
    const category = await Category.find()
    if (!category) {
        return res.status(400).json({ error: 'something went wrong ' })
    }
    res.send(category)
}

// category details
exports.categoryDetails = async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: 'something went wrong ' })
    }
    res.send(category)
}

// update category
exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name: req.body.category_name
        },
        { new: true }
    )
    if (!category) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(category)
}

// delete category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (!category) {
                return res.status(403).json({ error: 'category not found' })
            }
            else {
                return res.status(200).json({ message: 'category deleted' })
            }
        })
        .catch(err => {
            return res.staus(400).json({ error: err })
        })
}
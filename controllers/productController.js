const Product = require('../models/productModel')

// post product
exports.postProduct = async (req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInStock: req.body.countInStock,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category: req.body.category
    })
    product = await product.save()
    if (!product) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(product)
}

// list product
exports.listProduct = async (req, res) => {
    const list = await Product.find()
    if (!list) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(list)
}

// update product
exports.updateProduct = async (req, res) => {
    const upd = await Product.findByIdAndUpdate(
        req.params.id,
        {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            countInStock: req.body.countInStock,
            product_description: req.body.product_description,
            product_image: req.file.path,
            category: req.body.category
        },
        { new: true }
    )
    if (!upd) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(upd)
}

// product details
exports.detailsProduct = async (req, res) => {
    const detail = await Product.findById(
        req.params.id,
    )
    if (!detail) {
        return res.staus(400).json({ error: 'something went wrong' })
    }
    res.send(detail)
}
// delete product
exports.deleteProducts = async (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(del => {
            if (!del) {
                return res.status(403).json({ error: 'product not found' })
            }
            else {
                return res.status(400).json({ error: 'product already deleted' })
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

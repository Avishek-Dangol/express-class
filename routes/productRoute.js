const express=require('express')
const { deleteCategory } = require('../controllers/categoryController')
const { postProduct, listProduct, updateProduct, detailsProduct } = require('../controllers/productController')
const router=express.Router()
const upload=require('../middleware/file-upload')
const { productValidation, validation } = require('../validation/validator')
const {requireSignin} =require('../controllers/userController')



router.post('/postproduct',requireSignin,upload.single('product_image'),productValidation,validation,postProduct)
router.get('/listproduct',listProduct)
router.put('/updateproduct/:id',requireSignin,productValidation,validation,updateProduct)
router.get('/detailsproduct/:id',detailsProduct)
router.delete('/deleteproduct/:id',requireSignin,deleteCategory)

module.exports=router
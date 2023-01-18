const express=require('express')
const { testFunction, postCategory, categoryList, categoryDetails, updateCategory, deleteCategory,} = require('../controllers/categoryController')
const {validation, categoryValidation } = require('../validation/validator')
const router=express.Router()
const {requireSignin} =require('../controllers/userController')


router.get('/first',testFunction)
router.post('/postcategory',requireSignin,categoryValidation,validation,postCategory)
router.get('/categorylist',categoryList)
router.get('/catagorydetails/:id',categoryDetails)
router.put('/updatecategory/:id',requireSignin,categoryValidation,validation,updateCategory)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)

module.exports=router
const{check,validationResult}=require('express-validator')
exports.categoryValidation=[
    check('category_name','Category must be required').notEmpty()
    .isLength({min:3})
    .withMessage('category name must contain atleast 3 characters')
]

exports.productValidation=[
    check('product_name','Product must be required').notEmpty()
    .isLength({min:3})
    .withMessage('product name must contain atleast 3 characters'),

    check('prouct_price','price is required').notEmpty()
    .isNumeric()
    .withMessage('proice only contain numeric value'),

    check('product_description','Description must be required').notEmpty()
    .isLength({min:30})
    .withMessage('product decscription must contain atleast 30 characters'),

    check('countInStock','stock quantity is required').notEmpty()
    .isNumeric()
    .withMessage('Stock Quantity only contain numeric value'),

    check('category','category is required').notEmpty()
]

exports.userValidation=[
check('email','email is reqired').notEmpty()
.isEmail()
.withMessage('the email you have provided is invalid'),

check('password','Please provide a password').isEmpty()
.matches('')

]
exports.validation=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error:errors.array()[0].msg})
    }
}

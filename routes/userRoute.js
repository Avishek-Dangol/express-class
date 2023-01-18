const express = require('express')
const { userRegister, postEmailConfirmation, signIn, forgetPassword, resetPassword, userList, singleUser, requireSignin, signOut, resendEmail } = require('../controllers/userController')
const router = express.Router()

router.post('/register', userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetPassword)
router.get('/userlist',requireSignin,userList)
router.get('/singleuser/:id',requireSignin,singleUser)
router.post('/signout',signOut)
router.post('/resendemail',resendEmail)



module.exports = router
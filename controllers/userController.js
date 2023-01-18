const User = require('../models/authModel')
const sendEmail = require('../middleware/setEmail')
const crypto = require('crypto')
const Token = require('../models/tokenModel')
const jwt = require('jsonwebtoken') //authentication 
const {expressjwt}=require('express-jwt')//authorization
const { findOne } = require('../models/authModel')

// register user
exports.userRegister = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    //here first email is the email taken from User and .email is the wmail going to be sent
    User.findOne({ email: user.email }, async (error, data) => {
        if (data == null) {
            user = await user.save()
            if (!user) {
                return res.status(400).json({ error: 'something went wrong' })
            }
            //store token in model
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: user._id
            })
            token = await token.save()
            if (!token) {
                return res.status(400).json({ error: 'something went wrong' })
            }
            //sendEmail
            sendEmail({
                from: 'no-reply@ecommerce.com',
                to: user.email,
                subject: 'Email Verification Link',
                text: `Hello,\n\n  Please verify your email by click in the link below \n\n
                http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`

                //http://localhost:4000/api/confirmation
            })


            res.send(user)
        }
        else {
            return res.status(400).json({ error: 'email must be unique' })
        }
    })

}

//confirming email
exports.postEmailConfirmation = (req, res) => {
    //at first find the matching or valid token
    Token.findOne({ token: req.params.token }, (error, token) => {
        if (error || !token) {
            return res.status(400).json({ error: 'invalid token or the token has expired' })
        }
        //if token found then find the valid user for that token
        User.findOne({ _id: token.userId }, (error, user) => {
            if (error || !user) {
                return res.status(400).json({ error: 'we are unable to find the valid user for this token' })
            }
            //check if user is already verified or not
            if (user.isVerified) {
                return res.status(400).json({ error: 'this email is already verified, login to continue' })
            }
            //save the verified user
            user.isVerified = true
            user.save((error) => {
                if (error) {
                    return res.status(400).json({ error: error })
                }
                res.json({ message: 'your email has been verified, login to continue' })
            })
        })
    })
}

//signin process
exports.signIn = async (req, res) => {
    const { email, password } = req.body
    //at first check if email is registered in the system or not 
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(403).json({ error: 'sorry the email you have provided is not found in our system,please register or try another' })
    }
    // if email found then check the correct password for that email
    if (!user.authenticate(password)) {//hashing gareko le authenticate
        return res.status(400).json({ error: 'email or password doesnot match' })
    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: 'please verify your email to continue the process' })
    }
    //now generate token with user id and jwt secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    //store token in the cookie
    res.cookie('myCookie', token, { expire: Date.now() + 999999 })
    //return user information to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { _id, name, email, role } })
}
//forget password
exports.forgetPassword = async (req, res) => {
    //at first check if email is registered in the system or not 
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ error: 'sorry the email you have provided is not found in our system,please register or try another' })
    }
    //store token in model
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'something went wrong' })

    }
    //sendEmail
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'password reset Link',
        text: `Hello,\n\n  Please verify your password by click in the link below \n\n
        http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`

        //http://localhost:4000/api/confirmation
    })

    res.json({ message: 'password reset link has been sent to your email' })
}

//reset password
exports.resetPassword = async (req, res) => {
    //at first find the valid token 
    const token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: 'invalid token or the token has expired' })
    }
    //if token found then fiind the valid user for that token
    let user = await User.findOne({ _id: token.userId })
    if (!user) {
        return res.status(400).json({ error: 'we are unable to find the valid user for this token' })
    }
    //reset password function
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: 'failed to reset password' })
    }
    res.json({ message: 'password has been reset succesfully' })

}

//user list 
exports.userList = async (req, res) => {
    const user = await User.find()
        .select('-hashed_password')
        .select('-salt')
    if (!user) {
        return res.status(400).json({ error: 'something went wrong'})
    }
    res.send(user)
}

//single user
exports.singleUser = async (req, res) => {
    const user = await User.findById(
        req.params.id)
            .select('-hashed_password')
            .select('-salt')
    
    if (!user) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(user)
}

//reqiure signin

exports.requireSignin = expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256']
})

//resend confirmation for email
exports.resendEmail = async (req, res) => {
    //at first check if email is registered in the system or not 
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(403).json({ error: 'sorry the email you have provided is not found in our system,please register or try another' })
    }
     //check if user is already verified or not
     if (user.isVerified) {
        return res.status(400).json({ error: 'this email is already verified, login to continue' })
    }
    //check if token has expired or not
    const tokenValue =await  Token.findOne({userId:user._id})
    if (tokenValue!==null){
       return res.status(400).json({error:'you have an active token ,please verify from there'})
    }
    //store token in model
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'something went wrong' })

    }
    //sendEmail
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'email re-confirmation Link',
        text: `Hello,\n\n  Please verify your email by click in the link below \n\n
        http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`

        //http://localhost:4000/api/confirmation
    })

    res.json({ message: 're-confirmation link has been sent to your email' })
}




//signout
exports.signOut=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout successful'})
}
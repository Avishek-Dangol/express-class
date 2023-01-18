const mongoose =require('mongoose')
const crypto =require('crypto')
//user understandanle bata not-understandable(crypto)
const uuidv1=require('uuidv1')
const { timeStamp } = require('console')

const authSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:Number,
        default:0,
        required:true
    },
    isVerified:{
        type:Boolean,//boolean means true or false
        default:false
    },
    salt:String,
    hashed_password:{
        type:String,
        required:true
    }
},{timeStamp:true})

// virtual fields
authSchema.virtual('password')//for certain time store garna(virtual)
.set(function(password){
    this._password=password  //this chai authSchema bitra cha bhaneko
    this.salt=uuidv1()
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this._password
})

// defining method
authSchema.methods={
    encryptPassword:function(password){
        if(!password) return ''
        try{
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }
        catch(err){
            return ''
        }
    },
    authenticate:function(plainText){
        return this.encryptPassword(plainText)=== this.hashed_password
    }
}

module.exports=mongoose.model('User',authSchema)
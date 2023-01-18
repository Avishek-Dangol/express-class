const mongoose=require('mongoose')
//schema=structure
const categorySchema= new mongoose.Schema({
    category_name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{timestamps:true})
// createdAt
// updatedAt
 module.exports=mongoose.model('Category',categorySchema)
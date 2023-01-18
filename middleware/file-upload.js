const multer=require('multer')//file upload
const fs=require('fs')//folder upload 
const path=require('path')//to read name
const { extname } = require('path')

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        let fileDestination='public/uploads'
        // check if directory exists
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true})
            //parent and sub folder create garcha recursive true le
            callback(null,fileDestination)

        }
        else{
            callback(null,fileDestination)
        }
    },
    filename:(req,file,cb)=>{
        let filename=path.basename(file.originalname,path.extname(file.originalname))
        // path.basename(abc.jpg,.jpg)
        // abc
        let ext=path.extname(file.originalname)
        // .jpg
        cb(null,filename+'_'+Date.now()+ext)
        // abc_012344.jpg
    }
})

let imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|svg|gif|jpeg|jfif|JPG||PNG|JPG|PNG|SVG|GIF|JPEG|JFIF)$/)){
return cb(new Error('You can upload image file only'),false)
    }
    else {
        cb(null,true)
    }
}

const upload=multer({
    storage:storage,
    fileFilter:imageFilter,
    limits:{
        fileSize:4000000  //4mb
    }
})

module.exports=upload
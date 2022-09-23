const multer = require("multer");
const path = require('path')



const storage = multer.diskStorage({
    destination: './public/upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }

})

var upload = multer({
    storage: storage,fileFilter:function(req,file,callback){
        if(
            file.mimetype =='image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'application/pdf'
        ){
            callback(null,true)
        }else{
            console.log('Only jpg, png and pdf file are supported')
            callback(null, false)
        }
    },
    limits:{
        fileSize: 1024 * 1024 * 2
    }

}) 

module.exports = upload
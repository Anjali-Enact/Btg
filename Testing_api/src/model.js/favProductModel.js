const mongoose=require('mongoose')
const favJobSchema=new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId ,
        required:true, 
    },
    vendor_id:{
      type:mongoose.Schema.Types.ObjectId ,
        required:true, 
    }
 
   
    
},{timestamps:true})
const favProductModel=new mongoose.model('fav_product',favJobSchema)
module.exports=favProductModel
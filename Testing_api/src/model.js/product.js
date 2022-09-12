const mongoose = require('mongoose');
const imageArray=new mongoose.Schema({
    image: {
        type: String,
        default: ''
    },

})

const productSchema = new mongoose.Schema({
   vendor_id:{
      type:mongoose.Types.ObjectId,
      required:true
   },
   
    product_name:{
        type:String,
        default:' '
     },

     image:[imageArray],

     price:{
        type:Number,
        default:''
     },

     discount:{
        type:String,
        default:''
     },

     cat_id:{
        type:mongoose.Types.ObjectId,
        required:true
     },

     sub_cat_id:{
        type:Number,
        required:true
     },

     store_id:{
      type:mongoose.Types.ObjectId,
   
     }

})


    const Product= new mongoose.model('product',productSchema);
module.exports = Product;
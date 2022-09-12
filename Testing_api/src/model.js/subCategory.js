const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    subCategory_name:{
        type:String,
        default:''
     },

})


    const Sub_Category= new mongoose.model('subCategory',subCategorySchema);
module.exports =Sub_Category;
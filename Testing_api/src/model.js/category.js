const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name:{
        type:String,
        default:''
     },

})


    const Category= new mongoose.model('categories',categorySchema);
module.exports = Category;
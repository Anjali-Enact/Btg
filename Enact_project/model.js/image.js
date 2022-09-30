const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image:{
        type:String,
        default: '',
        
     },

})


    const Image= new mongoose.model('images',imageSchema);
module.exports = Image;
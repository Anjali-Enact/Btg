const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
        default:''

    },

    business_email:{
        type:String,
        required:true,
        unique:true,
        default:''
    },
    
    logo:{
        type:String,
        default:'',
        required: true
    },

    address:{
        type:String,
        required:true,
        default:''
    },

    pin:{
        type:Number,
        required:true,
        default:''
    }
},{timestamps:true})



const Store= new mongoose.model('stores',storeSchema);
module.exports = Store;

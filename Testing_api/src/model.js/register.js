const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const passwordArray=new mongoose.Schema({
    password: {
        type: String,
        default: '',
        
    },
    createdAt:{
        type:Number,
        required:true
    }

})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },

    email:{
        type:String,
        required:true,
       
    },
    
    phone:{
        type:Number,
        minlength:10,
       default:''
    },

    password:{
        type:String,
        required:true,
        minlength:10
    },
    oldPassword:[passwordArray],

    token:{
        type:String,
        default:''
    },
    resetLink:{
      data:String,
      default:''
    }
},{timestamps:true})








userSchema.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })




const Person = new mongoose.model('registers',userSchema);
module.exports = Person;
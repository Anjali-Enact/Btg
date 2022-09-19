const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const registerSchema = new mongoose.Schema({
    first_name:{
        type:String,
         require:true
     },

     last_name:{
        type:String,
        require:true

     },

     email:{
        type:String,
        require:true
     },

     password:{
        type:String,
        require:true
     }

})

// registerSchema.pre("save", function (next) {
//    const user = this
 
//    if (this.isModified("password") || this.isNew) {
//      bcrypt.genSalt(10, function (saltError, salt) {
//        if (saltError) {
//          return next(saltError)
//        } else {
//          bcrypt.hash(user.password, salt, function(hashError, hash) {
//            if (hashError) {
//              return next(hashError)
//            }
 
//            user.password = hash
//            next()
//          })
//        }
//      })
//    } else {
//      return next()
//    }
//  })


    const Register= new mongoose.model('registers',registerSchema);
module.exports = Register;
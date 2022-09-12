const mongoose = require ('mongoose');
const changePasswordSchema = new mongoose.Schema({
    
    newPassword:{
        type:String,
        required : true

    }
    
})

changePasswordSchema.pre("save", async function(next) {
  
    if(this.isModified("newPassword")) {
       
        this.password = await bcrypt.hash(this.newPassword, 10);
        this.newPassword = await bcrypt.hash(this.newPassword,10);

    }
    next();
})

const Password = new mongoose.model('updated details',changePasswordSchema)
module.exports = Password;
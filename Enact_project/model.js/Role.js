const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role:{
        type:String,
        default: 'Staff',
        enum :['Admin', 'Subadmin', 'Clinic', 'Staff']
     },

})


    const Role= new mongoose.model('roles',roleSchema);
module.exports = Role;
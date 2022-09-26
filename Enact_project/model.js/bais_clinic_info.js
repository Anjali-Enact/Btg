const mongoose = require('mongoose');

const locations_geometry_array=new mongoose.Schema({
    type:String,
    coordinates:[]
 
 })

 const address_array = new mongoose.Schema({

    line1: {
        type: String,
        default: ''
    },
    line2: {
        type: String,
        default: ''
    },
    district: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default:''
    },
    state:{
        type: String,
        default:''
    },
    country: {
        type: String,
        default:''
    },
    postal_code:{
      type: Number,
      default:''
    },
    
    is_default: {
        type: Boolean,
        default: 0,                       //1 is primary location
        enum: [0, 1]
    },
    lat:{
      type:String,
      default:''
    },
    lng:{
        type:String,
        default:''
    },
    locations_geometry:[locations_geometry_array]
})

const clinicSchema = new mongoose.Schema({
    service:{
        type:String,
        default: '',
        
     },

     logo:{
        type:String,
        default:''
     },

     clinic_location:[address_array]

})


    const ClinicInfoModel= new mongoose.model('clinic',clinicSchema);
module.exports = ClinicInfoModel;
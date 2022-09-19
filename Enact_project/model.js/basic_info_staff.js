const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

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
      address:{
       type:String,
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

  const education_array = new mongoose.Schema({
   start_date: {
       type: Date,
   },
   end_date: {
       type: Date
   },
   location: {
       type: String,
       default: ''
   },
   university_name: {
       type: String,
       default: ''
   },
   degree_name: {
       type: String,
       default: ''
   },
   total_year: {
       type: String,
       default: ''
   }
  
})

const Staff_Info_Schema= new mongoose.Schema({
   image:{
      type:String,
      default:'',
      required: true
  },
  address:[address_array],
  qualifiaction:[education_array]
},

{timestamps: true}
)


Staff_Info_Sc.index({ "address.locations_geometry": "2dsphere" });
const StaffInfoModel = mongoose.model("staff", Staff_Info_Schema);
module.exports = StaffInfoModel;
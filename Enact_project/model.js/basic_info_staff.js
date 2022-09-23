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

const documents_array = new mongoose.Schema({
    Highschool_certificate:{
        type:String,
        default:''
    },
    Inter_certificate:{
        type:String,
        default:''
    },
    Graduation_certificate:{
        type:String,
        default:''
    },

    Post_Graduation_certificate:{
        type:String,
        default:''
    },
    Any_Certification:{
        type:String,
        default:''
    }
})

const Staff_Info_Schema= new mongoose.Schema({
  
    user_id:{
       type:mongoose.Schema.Types.ObjectId,
       require:true
    },
   image:{
      type:String,
      default:'',
     
  },
  resume:{
    type:String,
    default:'',
  },
  address:[address_array],
  qualification:[education_array],
  documents:[documents_array]
},

{timestamps: true}
)



const StaffInfoModel = mongoose.model("staff", Staff_Info_Schema);
module.exports = StaffInfoModel;
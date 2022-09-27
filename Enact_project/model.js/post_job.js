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

const skills_array=new mongoose.Schema({
    type:String,
    required:true
 
 })

 const Post_Job_Schema = new moongoose.Schema({

    job_type:{
      type:String,
      required:true
    },

    posted_by:{
        type:String,
        required:true
    },
    expire_date:{
        type:Date,
        default:''
    },
    year_of_experience:{
        type:Number,
        required:true
    },

    job_type:{
        type:String,
        default: '',
        enum :['part_time', 'full_time', 'hybrid', ]
     },

     job_location:[address_array],
     skills:[skills_array]

 }, {timestamps: true})

 const PostJobModel = mongoose.model("Jobs", Post_Job_Schema);
module.exports = PostJobModel;

const express = require('express');
const mongosee = require('mongoose')
const StaffDetails = require('../model.js/basic_info_staff')
const router= require('../router/StaffDetails')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const {body, validationResult} = require("express-validator");


exports.staffInfo=[
    body('user_id').exists().notEmpty().withMessage('user_id is required.'),
   
    async(req,res)=>{
       
      try{
        let fetchData={
            user_id : req.body._id,
            name:req.body._id
            

        }
        const data = await Role.create(fetchData);
        console.log(data)



        res.status(200).json(data);
    }catch(error){
        console.log(error)

    }

    }


]
// const express = require('express');
// const mongosee = require('mongoose')
// const Role = require('../model.js/Role')
// //const route= require('../router')
// const jwt = require('jsonwebtoken')
// require("dotenv").config();
// const {body, validationResult} = require("express-validator");

// exports.Role=[
//     body('role').exists().notEmpty().trim().withMessage('Role Is Required.'),

//     async(req,res)=>{
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return Response.validationErrorWithData(res, "Please Enter Required Field", errors.array())

//             } else {
                
//                 let insertData = {
//                     role: req.body.role,
                   
//                 };

//                 let data = await Register.create(insertData)
//                 let token = jwt.sign(data.toJSON(), process.env.PASSPORT_KEY,
//                     {expiresIn: process.env.JWT_TIMEOUT_DURATION})
//             }
//         } catch (error) {
            
//         }
//     }
// ]

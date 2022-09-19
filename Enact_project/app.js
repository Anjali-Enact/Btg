const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express");
const route = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('./db/Conn')
//const router = require("./router");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const { body, validationResult } = require("express-validator");
const RoleController = require('./controllers/RoleController');
const Role = require('./model.js/Role');
const Register = require('./model.js/Register')
const Utill = require("./helper.js/Constant")
//const views = require("./public/views")
//const { RegisterController } = require('./controllers/Register');


const nodemailer = require("nodemailer")
const randomstring = require('randomstring')

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(router);

app.get('/', (req, res) => {
    res.send('Welcome To BTG ');

})

var transporter = nodemailer.createTransport({
    service: Utill.EMAIL_SERVICE,
    auth: {
        user: Utill.EMAIL,
        pass: Utill.EMAIL_PASSWORD
    }
})

//     const sendPasswordMail=async(name,email,password)=>{
//         try {
//           const transporter=  nodemailer.createTransport({
//                host:'smtp.gmail.com',
//                secure:false,

//                auth:{
//                    user:Utill.EMAIL,
//                    pass:Utill.EMAIL_PASSWORD
//                }
//            })



//         } catch (error) {
//            console.log(error)
//         }
//    }

//verifying token
function verifyToken(req, res, next) {
    try {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(401).send('UnAuthorized')
        } else {
            var Token = token.split(" ")[1];
            //console.log('----',Token)
            jwt.verify(Token, "asdfghjklqwertyuiozxcvbn", async function (err, decoded) {
                if (err) {
                    console.log(err)
                    return res.send("Unauthorized User")
                }

                //console.log(decoded)
                Person.findOne({ _id: decoded._id })
                    .then((data) => {
                        if (!data) {
                            return res.send("User not found")
                        } else {
                            req.userData = decoded
                            next()
                        }
                    }).catch((e) => {
                        return res.send(e)
                    })
            });
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


app.post('/role', [body('role').exists().notEmpty().trim().withMessage('Role Is Required.')],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Response.validationErrorWithData(res, "Please Enter Required Field", errors.array())

            } else {

                let insertData = {
                    role: req.body.role,

                };
                console.log(insertData)
                const data = await Role.create(insertData);
                console.log(data)



                res.status(200).json(data);


            }
        } catch (error) {
            console.log(error)
            res.send(error)

        }
    })


app.post("/register", [
    body('email').exists().notEmpty().trim().withMessage('Email is required.').custom((value) => {
        return Register.findOne({ email: value }).then((user) => {
            if (user) {
                return Promise.reject("email already exists.");
            }
        });
    }),
    body('first_name').exists().notEmpty().withMessage('First_Name is required.'),
    body('last_name').exists().notEmpty().withMessage('Last_Name is required.'),
], async (req, res) => {
    console.log('yhn')
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: "Validation Error.", error: errors.array() });
        }
        //const spassword = await securePassword(req,body.password)
        // let hashPassword = bcrypt.hashSync(password, 10);

        let insertData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            // password:sendPasswordMail(),

        }
        //const email = req.body.email
        const Data = await Role.create(insertData);
        console.log(Data)

        let token = jwt.sign(Data.toJSON(), "asdfghjklqwertyuiozxcvbn", {
            expiresIn: "10h"
        }
        )
        Data.id.token = token;
        console.log(token)
        const mailOptions = {
            from: Utill.EMAIL,
            to: req.body.email,
            subject: Utill.EMAIL_SUBJECT,
            html: '<p> Hii ' + req.body.first_name + ' , Please click the link and <a href="http://localhost:5000/set-password?token=' + token + '">Set password</a>'

        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("mail has been sent:-", info.response)
            }
        })

        console.log(insertData)

        const data = await Register.create(insertData);
        console.log(data)


        //console.log(createUser);
        res.status(200).json({ sucess: true, message: "Mail has been sent" });


    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get('/set-passsword/:token', verifyToken, async (req, res) => {
    const token  = req.params
    //check if this token is there or not 
    if (token) {
        jwt.verify(token, "asdfghjklqwertyuiozxcvbn", function (err, decodedToken) {
            if (err) {
                return res.status(400).json({ error: "Incorrect or Expired Link." })
            }
            res.render('/set-password')

        })
    }


   
})

app.post('/set-passsword/:token', async(req,res)=>{
    const token= req.params
})


app.listen(port, () => {
    console.log(`Connection is setup at ${port}`);
})
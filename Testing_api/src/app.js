const dotenv = require('dotenv').config()
const express = require("express");
const Person = require('./model.js/register')
const Category = require('./model.js/category')
const Sub_Category = require('./model.js/subCategory')
require('./db/conn')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
//const jwtKey ='e-com'
const { validationResult, body } = require('express-validator');
const multer = require('multer');
const Store = require("./model.js/store");
const path = require('path')
const helper = require("./Utility/helper");
const Product = require('./model.js/product');
const favProductModel = require('./model.js/favProductModel');
//const jwt = require('jsonwebtoken')
//const key = require('./key')
const fs = require('fs')
const Password = require('./model.js/update_password');
const config = require('./config/config')
const { default: mongoose } = require('mongoose');
const { timeStamp } = require('console');
const { listeners } = require('process');
const ObjectId = mongoose.Types.ObjectId
const nodemailer = require("nodemailer")
const randomstring = require("randomstring")
const mailgun = require("mailgun-js");
const { SignUpSuccessFull } = require('./Utility/helper');
const DOMAIN = 'sandbox6ab0dd8364f64027a013bd6db51fd640.mailgun.org'
const mg = mailgun({ apiKey: "977b7b29f7f46268f774c5337812c06d-07a637b8-203569b6", domain: DOMAIN });

const sendResetPasswordMail=async(name,email,token)=>{
     try {
       const transporter=  nodemailer.createTransport({
            host:'smtp.gmail.com',
            secure:false,
            
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })

        const mailOptions ={
            from:config.emailUser,
            to:email,
            subject:config.EMAIL_SUBJECT,
            html:'<p> Hii '+name+' , Please copy the link and <a href="http://192.168.1.17:5000/reset-password?token='+token+'">reset password</a>'

        }
        transporter.sendMail(mailOptions,function(error, info){
            if(error){
                console.log(error)
            }
            else{
                console.log("mail has been sent:-", info.response)
            }
        })

     } catch (error) {
        res.status(400),send({sucess:false, msg:error.message})
     }
}





const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: './public/upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }

})

const upload = multer({
    storage: storage,

})


app.use(express.static('./public/upload/images'))
//app.use(express.static('.env'))



// to read home page
app.get("/", (req, res) => {
    res.send("Hello User");
})

//reading login data
app.get('/login', async (req, res) => {

    try {
        const userData = await Person.find();
        res.send(userData)
    } catch (error) {
        res.send(error)
    }

})

//Reading store data
app.get('/store', (req, res) => {
    res.send("storedata")
})

//Reading registration data
app.get("/registration", async (req, res) => {
    try {
        const registrationData = await Person.find()
        res.status(200).send(registrationData);

    } catch (e) {
        res.status(400).send(e);
    }
})



//handling login data
app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        //console.log(req.body)
        //console.log(password);
        const useremail = await Person.findOne({ email: email })

        if (!useremail) {
            return res.status(200).json({ statusCode: 400, message: "wrong email or password" })
        }

        const isMatch = await bcrypt.compare(password, useremail.password);

        let token = jwt.sign(useremail.toJSON(), "asdfghjklqwertyuiozxcvbn", {
            expiresIn: "100h"
        }
        )
        useremail.id.token = token;

        // console.log(token);
        //console.log("Secret",JWT_KEY);

        if (isMatch) {
            res.status(200).json({ statusCode: 200, message: "login sucessful", userDetails: useremail, token: token })
        } else {
            res.send("Invalid Login details");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})


//singup

app.post('/signup', async (req, res) => {
    console.log(req.body)
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const useremail = await Person.findOne({ email: email })

    if (useremail) {
        return res.status(400).send('Email already exist')
    }

    const token = jwt.sign({ name, email, password }, "mynameisanjaliimafrontenddeveloper", { expiresIn: '20m' })

    const data = {
        from: 'noreply@hello.com',
        to: email,
        subject: 'Account Activation Link',
        html: `
        <h2>Please click on given link to activate your account</h2>
        <p>localhost: 5000/authentication/activate/${token}</p>
        `
    };

    mg.messages().send(data, function (error, body) {
        if (error) {
            return res.json({
                error: error.message
            })
        }
        return res.json({ message: 'Email has been sent, Kindly activate your account' })
        //console.log(body)

    });



})

app.post('/activateAccount', async (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, "mynameisanjaliimafrontenddeveloper", function (err, decodedToken) {
            if (err) {
                return res.status(400).json({ error: "Incorrect or Expired Link." })
            }
            const { name, email, password } = decodedToken;
            Person.findOne({ email: email }, async (req, user) => {
                if (user) {
                    return res.status(400).json({ error: "User with this email already exists." })
                }
                let newUser = new Person({ email, name, password })
                newUser.save((err, sucess) => {
                    if (err) {
                        console.log("Error in signup:", err)
                        return res.status(400).json({ error: err })
                    }
                    res.json({
                        message: "Signup sucessfull"
                    })
                })
            })
        })
    } else {
        return res.json({ error: 'Something went wrong !' })
    }

})







//handling registration data
app.post("/registration", [
    body('email').exists().notEmpty().trim().withMessage('Email is required.').custom((value) => {
        return Person.findOne({ email: value }).then((user) => {
            if (user) {
                return Promise.reject("email already exists.");
            }
        });
    }),
    body('name').exists().notEmpty().withMessage(' name is required.'),
    body('phone').exists().notEmpty().withMessage('Phone Number is required.'),
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: "Validation Error.", error: errors.array() });
        }
        //const spassword = await securePassword(req,body.password)

        const user = new Person(req.body);
        const createUser = await user.save();
        //console.log(createUser);
        res.status(200).json(createUser);


    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

app.post("/upload", upload.single('logo'), async (req, res) => {
    console.log('asdfghj')
    try {

        let insertData = { logo: req.file.filename }
        console.log(insertData);


        res.json({
            sucess: 1,
            logo_url: `http:// 192.168.1.17:5000/logo/${req.file.filename}`,
            logoDetails: insertData
        })
    }
    catch (error) {

        console.log(error)
        res.status(400).send(error)
    }

})




//Handling store data
app.post("/store", verifyToken, upload.single('logo'), [
    body('business_email').exists().notEmpty().trim().withMessage('Email is required.').custom((value) => {
        return Store.findOne({ business_email: value }).then((user) => {
            if (user) {
                return Promise.reject("email already exists.");
            }
        });
    }),
    body('user_name').exists().notEmpty().withMessage(' name is required.'),


], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: "Validation Error.", error: errors.array() });
        }


        let insertData = { business_email: req.body.business_email, user_name: req.body.user_name, address: req.body.address, pin: req.body.pin, logo: req.file.filename }
        console.log(insertData);
        const createStore = await Store.create(insertData);

        res.status(200).json(createStore);


    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

})


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


app.post('/category', async (req, res) => {
    try {
        const category = new Category(req.body);
        const createCategory = await category.save()
        res.status(201).send(createCategory);

    } catch (error) {
        res.status(400).send(error);

    }

})

app.get('/category', async (req, res) => {
    try {
        const categoryData = await Category.find()
        res.status(200).send(categoryData);

    } catch (error) {
        res.status(400).send(error);

    }

})

app.post('/subCategory', async (req, res) => {
    try {
        const sub_category = new Sub_Category(req.body);
        const createsubCategory = await sub_category.save()
        res.status(201).send(createsubCategory);

    } catch (error) {
        res.status(400).send(error);

    }

})

app.get('/subCategory', async (req, res) => {
    try {
        const subcategoryData = await Sub_Category.find()
        res.status(200).send(subcategoryData);

    } catch (error) {
        res.status(400).send(error);

    }

})


app.post('/product', verifyToken, upload.array('image', 5), async (req, res) => {
    try {
        console.log(req.files)


        let image_array = []
        req.files.forEach(element => {
            image_array.push({
                image: element.filename,
                //url: baseUrl + element.filename
            })
        })
        console.log(image_array)
        // return res.status(200).send(imgage_array);
        let insertData = {
            vendor_id: req.userData._id,
            product_name: req.body.product_name,
            price: req.body.price,
            discount: req.body.discount,
            image: image_array,
            cat_id: req.body.cat_id,
            sub_cat_id: req.body.sub_cat_id
        }
        console.log(insertData);

        const createProduct = await Product.create(insertData);
        return res.status(201).send(createProduct);
        //return res.status(200).send(imgage_array);

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

app.get('/product', async (req, res) => {
    try {
        const productData = await Product.find()
        res.status(200).send(productData);

    } catch (error) {
        res.status(400).send(error);

    }

})


//update password

app.post('/update_password', async (req, res) => {

    try {
        const email = req.body.email;
        var password = req.body.password;
        //const password1 = req.body.password1
        // console.log(email)
        //console.log(password)
        const useremail = await Person.findOne({ email: email })
        console.log(useremail)
        if (useremail) {
            const isMatch = await bcrypt.compare(password, useremail.password)
            let hashPassword = bcrypt.hashSync(password, 10);

            if (!isMatch) {
                console.log('-----', hashPassword)

                const updatedPassword = await Person.updateOne({


                    _id: ObjectId(useremail._id),
                    //"password": req.body.password1
                },
                    { $set: { password: hashPassword } }
                )
                console.log(updatedPassword)
                res.send({ statusCode: 200, message: "Updated sucessful" });
            } else {
                res.send("Details not matched");
            }
        }


    } catch (error) {
        console.log(error)
        res.send(error)
    }

})

app.post('/checkPassword_update', async (req, res) => {
    try {
        const email = req.body.email;

        var dateTimeStamp = Date.now();
        console.log(" Current Timestamp :: " + dateTimeStamp);
        const useremail = await Person.findOne({ email: email })


        if (!useremail) {
            res.send("enter valid email")
        }
        const insertPassword = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            createdAt: dateTimeStamp

        }

        // console.log(insertPassword)
        const size = useremail.oldPassword.length
        console.log(size)
        const isMatch = await bcrypt.compare(req.body.password, useremail.password);
        console.log(isMatch)

        if (size < 3 && !isMatch) {
            console.log(useremail.oldPassword.length)

            let update = await Person.updateOne({
                email: email,
            },
                { $push: { oldPassword: insertPassword } },
                //{ $set: { "useremail.password" : insertPassword } },
                { $limit: 3 }
            )

            const sort = await Person.aggregate([
                {
                    $match:
                    {
                        email: req.body.email
                    }
                },


                { $unwind: "$oldPassword" },
                { $sort: { "$oldPassword.createdAt": 1 } },
                { $limit: 1 },
                { $project: { oldPassword: -1 } }

            ])
            console.log(sort)
            res.send(sort)






        }
        else if (size >= 3 && !isMatch) {
            let hashPassword = await bcrypt.hashSync(req.body.password, 10);
            console.log(useremail.oldPassword)

            console.log(hashPassword)

            const updatePassword = await Person.aggregate([
                {
                    $match:
                        { email: email }
                },
                { $unwind: "$oldPassword" },
                { $project: { oldPassword: 1 } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 },

            ])
            console.log(updatePassword)



            let getoldPassword = updatePassword[2].oldPassword._id
            //console.log(getoldPassword)
            const updated = await Person.updateOne(
                { "oldPassword._id": getoldPassword },
                { $set: { "oldPassword.$": { password: hashPassword, createdAt: dateTimeStamp } } },
            )
            const current = await Person.updateOne({
                email: email
            },
                { $set: { password: hashPassword } }
            )
            console.log(hashPassword)






        }
        else {
            let hashPassword = await bcrypt.hashSync(req.body.password, 10);




            console.log(hashPassword)
            const updatePassword = await Person.aggregate([
                {
                    $match:
                        { email: email }
                },
                { $unwind: "$oldPassword" },
                { $project: { oldPassword: 1 } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 },

            ])
            console.log(updatePassword)

            let getoldPassword = updatePassword[2].oldPassword._id
            console.log(getoldPassword)
            const updated = await Person.updateOne(
                { "oldPassword._id": getoldPassword },
                { $set: { "oldPassword.$": { password: hashPassword, createdAt: dateTimeStamp } } },
            )
            const current = await Person.updateOne({
                email: email
            },
                { $set: { password: hashPassword } }
            )
            console.log(hashPassword)
            res.send(current)
        }













    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

//Update Image(multiple image)

app.post('/update_image', verifyToken, upload.array('image', 10), async (req, res) => {

    try {
        const _id = req.body._id
        // console.log("User_Id",_id)
        const new_image = req.files[0].filename
        console.log(new_image)
        const userId = await Product.findOne({ _id: _id })
        //const imageId = req.body.userId.image._id
        //console.log("------>",userId.image)
        //console.log("------------>",userId.image._id)
        // console.log("UserDetails",userId)


        if (!userId) {
            res.send("Enter valid Id")
        }


        let insertImage = {
            image: req.files[0].filename,

        }
        //console.log(insertImage);
        console.log("UpdatedImage", insertImage)

        // console.log(req.body)
        let imageId = req.body.imageId
        //console.log(imageId)
        let update = await Product.updateOne(
            { "image._id": imageId },
            { $set: { "image.$": { image: new_image } } }

        )
        console.log("Image---->", req.files[0].filename)
        console.log("After", update)
        res.send(update)



    } catch (error) {
        console.log(error)
        res.send(error)

    }

})

//forget password/reset password




app.post('/forgot_password', async (req, res) => {
    try {

        const email = req.body.email
        const useremail = await Person.findOne({ email: email })

        if(useremail){
            const randomString= randomstring.generate();
            const update =await Person.updateOne({ email: email },
                {$set:{token:randomString}})

                sendResetPasswordMail(useremail.name, useremail.email, randomString)
              res.status(200).send({sucess:true, msg:"Please check your mail "})
        }else{
            res.status(200).send({sucess:false, msg:"Mail does not exist"})
        }



    } catch (error) {
        console.log(error)
        res.send(error)
    }
})




// const sendResetPasswordMail = async(name, email, token)=>{
//     try {
//         const transpoter = nodemailer.createTransport({
//             host:'smtp.gmail.com',
//             port:5000,
//             secure:false,
//             requireTLS:true,
//             auth:{
//                 user:config.emailUser,
//                 pass:config.emailPassword
//             }
//         });
//         const mailOptions={
//             from:"noreply@hello.com",
//             to:useremail,
//             subject:'For Reset Password',
//             html:'<p>hii '+name+', pleasw click here to <a href= "http://192.168.1.17:5000/forgotPassword?token='+token+'">Reset</a> your password</p>'


//         }
//         console.log(mailOptions)
//         transpoter.sendMail(mailOptions, function(error, info){
//              if(error){
//                 console.log(error)
//              }
//         })
//     } catch (error) {
//         console.log(error)
//         res.send(error)
//     }
// }

// var transporter = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     service: config.EMAIL_SERVICE,
//     //path:"http://192.168.1.17:5000/forgotPassword?token='+token+'",
//     //secure:true,
//     // auth: {
//     //     user: config.emailUser,
//     //     pass: config.emailPassword
//     // }

//     auth: {
//         user: config.emailUser,
//          pass: config.emailPassword
//         }
        

// });



// app.post('/reset_password', async (req, res) => {
//     if (!(req.body.email)) {
//         res.send({
//             "success": false,
//             "message": "Please send all fields"
//         });
//         return false;
//     }
//     const token = jwt.sign({ _id:req.body.email._id }, "asdfsadfghjklertyuiop", {
//                     expiresIn: "10m"
        
//                })
//     var changepasswordId = makeid(20);

//     const email = req.body.email
//     const useremail = await Person.findOne({ email: email })
//     if (useremail) {
//         const update = await Person.updateOne(
//             { email: email },
//             {
//                 $set: {
//                     change_password: changepasswordId
//                 }
//             }) 
//                 if (!update) {
//                     throw err
//                 }
//                 // console.log("doc", doc)
//                 //console.log(user.modifiedCount)
               
//                 var mailOptions = {
//                     from: config.emailUser,
//                     to: req.body.email,
//                     subject: config.EMAIL_SUBJECT,
//                     html: '<p>Hii please click here to <a href= "http://192.168.1.17:5000/forgotPassword?token=' + token + '">Reset</a> your password</p>'

                         
//                 };
//                  transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(mailOptions)
//                         console.log(error)
//                         res.send({
//                             "success": true,
//                             "message": "Mail Not sent",
//                             "data": {}
//                         });
//                     } else {
//                         res.send({
//                             "success": true,
//                             "message": "We have emailed you instructions to reset your password. Kindly check your registered email for instructions.",
//                             "data": {}
//                         });
//                     }
//                 });
            
//     } else {
//         res.send({
//             "success": false,
//             "message": "Email Not Registered",
//             "data": {}
//         });
//         return false;
//     }





// })

// function makeid(length) {
//     var result = '';
//     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

// app.get('/forgotPassword', verifyToken,async(req,res)=>{
//     try {
//         const token = req.query.token
//        const tokenData=  Person.findOne({token:token})
//        if(token){
//            res.send('forgotPassword',{_id:tokenData._id});

//        }else{
//           res.send("token not found")
//        }
//     } catch (error) {
//         console.log(error.message)
//     }
// })

// app.get('/reset_Password', async(req,res)=>{

//     try {
//         const password = req.body.password;
//         const _id = req.body.user_id;

//         let hashPassword = bcrypt.hashSync(req.body.password, 10);
//        const updatedData= await Person.findByIdAndUpdate(
//             {_id:_id},
//             {$set:{password:hashPassword, token:''}}
//             )
//               res.send(updatedData)
//     } catch (error) {
//         console.log(error)
        
//     }
// })
















app.post('/favourite_product', [body('product_id').exists().notEmpty().trim().withMessage('Product Id  Is Required.')],

    async (req, res) => {

        try {
            console.log("efgbn")
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send("Please Enter Require Field ")
            } else {

                let favProduct = await favProductModel.updateOne(
                    { product_id: req.body.product_id },
                    { $push: { fav_product: req.body.product_id } })

                console.log(favProduct)

                // if (!favProduct.n)
                //     return res.send("Updation Failed To save favourite product")
                let insertData = {
                    product_id: req.body.product_id,

                    vendor_id: req.body.vendor_id,
                    // product_name:req.body.product_name,
                    // price:req.body.price,
                    // discount:req.body.discount,
                    // cat_id:req.body.cat_id
                }

                console.log(insertData)



                favProductModel.create(insertData).then(data => {
                    return res.send("Product Saved Successfully")
                })
                    .catch(e => {
                        return res.send(e)
                    })
            }
        } catch (e) {
            console.log(e)
            return res.send(e)

        }
    })

    



app.listen(port, () => {
    console.log(`Connection is setup at ${port}`);
})






























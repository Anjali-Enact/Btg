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
const ejs = require('ejs');
var path = require("path");
const StaffInfoModel = require('./model.js/basic_info_staff')
const Image = require('./model.js/image')
const PostJobModel = require('./model.js/post_job')
const uploadfile = require('express-fileupload')

//const views = require('./views')



//const { RegisterController } = require('./controllers/Register');
//const StaffDetailController = require('./controllers/StaffDetailController')


const nodemailer = require("nodemailer")
const randomstring = require('randomstring')

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
//app.use('/', router);
//app.use(express.static(path.join(__dirname, 'router')));

//app.use(router);

//const singleUpload = upload.single("image");
const multer = require("multer");
const ClinicInfoModel = require('./model.js/basic_clinic_info');



// SET STORAGE
const storage = multer.diskStorage({
    destination: './public/upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }

})

var upload = multer({
    storage: storage, fileFilter: function (req, file, callback) {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'application/pdf'
        ) {
            callback(null, true)
        } else {
            console.log('Only jpg, png and pdf file are supported')
            callback(null, false)
        }
    },


})

var multipleUpload = upload.fields([{name:'file1'},{name:'file2'},{name:'file3'},{name:'file4'},{name:'file5'}])

app.post('/uploadfile',verifyToken, multipleUpload,async(req,res)=>{

    try {
        if(req.files){
            console.log("Files uploaded")
            console.log(req.files)
            console.log(req.userData._id)

            let insertDocs= await StaffInfoModel.updateOne(
                {
                    user_id: req.userData._id
                },
                { $push: { documents: req.files.filename} 
            })
            console.log(insertDocs)
            res.send({
                "success":1,
                "message":"Files Uploaded"
            })
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})
app.get('/uploadfile',async(req,res)=>{
    res.render('uploadfile')
})





app.use(express.static('./public/upload/images'))




app.get('/', (req, res) => {
    res.send('Welcome To BTG ')

})

var transporter = nodemailer.createTransport({
    service: Utill.EMAIL_SERVICE,
    auth: {
        user: Utill.EMAIL,
        pass: Utill.EMAIL_PASSWORD
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
                Register.findOne({ _id: decoded._id })
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

    app.get('/get_role', async(req,res)=>{
        
        try {
         const roleData = await Role.find()
         res.send(roleData)
    
        } catch (e) {
            console.log(e)
            return res.send(e)
    
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
    //console.log('yhn')
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ message: "Validation Error.", error: errors.array() });
        }

        const useremail = req.body.email
        console.log(useremail)




        let insertData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,


        }
        console.log(insertData)

        const data = await Register.create(insertData);

        let token = jwt.sign(data.toJSON(), "asdfghjklqwertyuiozxcvbn", {
            expiresIn: "100h"
        }
        )
        data.id.token = token;
        console.log(data)



        data.id.token = token;
        console.log(token)
        const mailOptions = {
            from: Utill.EMAIL,
            to: req.body.email,
            subject: Utill.EMAIL_SUBJECT,
            html: '<p> Hii ' + req.body.first_name + ' , Please click the link and <a href="http://localhost:5000/register/' + token + '">Set password</a>'

        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("mail has been sent:-", info.response)
            }
        })




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
//
app.get('/register/:token', async (req, res) => {

    console.log(req.params)
    console.log('params', req.params.token)
    const token = req.params.token
    jwt.verify(token, "asdfghjklqwertyuiozxcvbn", async function (err, decoded) {
        if (err) {
            console.log(err)
            return res.send("Unauthorized User")
        }
        else {
            console.log(decoded._id)
            res.render('set_password', { id: decoded._id })
            // console.log(req.params._id)
        }

        //console.log(decoded)

    });




    //check id is exist or not 





})

app.post('/set_password', async (req, res) => {

    try {
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        console.log("------>", password)
        console.log('----------->', confirmPassword, req.body)

        console.log(req.body._id)



        //const isMatch = await bcrypt.compare(password, useremail.password)
        let hashPassword = bcrypt.hashSync(password, 10);
        console.log(hashPassword)




        const setPassword = await Register.updateOne({

            _id: req.body._id
        },


            {
                $set: { password: hashPassword }
            }
        )
        console.log(setPassword)
        res.send({ statusCode: 200, message: "Updated sucessful" });


    } catch (error) {
        console.log(error)

    }
})



app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        //console.log(req.body)
        //console.log(password);
        const useremail = await Register.findOne({ email: email })

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


app.post('/basic_staff_info', verifyToken, upload.single('image'), async (req, res) => {

    try {
        console.log(req.file.filename)

        let fields = {
            user_id: req.userData._id,
            image: req.file.filename
        }

        let checkExistProfile = await StaffInfoModel.findOne({ user_id: req.userData._id })
        if (!checkExistProfile) {
            let UpdateProfile = await StaffInfoModel.updateOne({ user_id: req.userData._id }, { $set: fields })
            StaffInfoModel.create(fields)

            return res.send({
                sucess: 1,
                image_url: `http:// 192.168.1.17:5000/logo/${req.file.filename}`,
                UserDetails: fields
            })
        } else {
            res.send("user already exist")
        }





    } catch (e) {
        console.log(e)
        return res.send(e)

    }





})


//for testing purpose
app.post("/upload", upload.single('image'), async (req, res) => {
    console.log('asdfghj')
    try {

        let insertData = { logo: req.file.filename }
        console.log(insertData);

        const data = await Image.create(insertData);
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


app.post("/addLocation", verifyToken, [
    body('line1').exists().notEmpty().trim().withMessage('line1 Is Required.'),
    body('line2').exists().notEmpty().trim().withMessage('line2  is required.'),
    body('city').exists().notEmpty().trim().withMessage('city is required.'),
    body('country').exists().notEmpty().trim().withMessage('country is required.'),
    body('postal_code').exists().notEmpty().trim().withMessage('postalCode is required.')
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.send("Please Enter Required Field", errors.array())

            } else {
                let locationData = {
                    line1: req.body.line1,
                    line2: req.body.line2,
                    district: req.body.district,
                    city: req.body.city,
                    country: req.body.country,
                    state: req.body.state,
                    postal_code: req.body.postal_code,
                    is_default: req.body.is_default ? req.body.is_default : 0,
                    lat: req.body.lat,
                    lng: req.body.lng,
                    locations_geometry: {
                        type: "Point",
                        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                    }
                }
                console.log(locationData)
                console.log(req.userData._id)
                let insertLocation = await StaffInfoModel.updateOne(
                    {
                        user_id: req.userData._id
                    },
                    { $push: { address: locationData } })

                return res.send({
                    sucess: 1,
                    message: "Location added successfully",
                    address: locationData
                })
            }
        } catch (e) {
            console.log(e)

            return res.send(e)

        }

    }
)


app.get("/getLocation", verifyToken, async (req, res) => {
    try {
        let getLocation = await StaffInfoModel.findOne({ user_id: req.userData._id })
        if (!getLocation) {
            return res.send("No Record found")
        }
        console.log(getLocation.address)
        return res.send({
            msg: 'Location Found Successfully',
            location: getLocation.address
        })

    } catch (e) {
        return res.send(e)

    }
})

app.post("/updateLocation", verifyToken, [
    body('address_id').exists().notEmpty().trim().withMessage('Location Id is required.')],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.send("Please Enter Required Field")

            } else {
                //  let getLocation=await CompanyProfileModel.updateOne({poster_id: req.userData._id})
                console.log('updateLocation')
                let locationData = ['line1', 'line2', 'district', 'city', 'country', 'state', 'postal_code', 'is_default', 'lat', 'lng']
                let setData = {}, appendLoc
                for (const loc of locationData) {
                    if (req.body[loc]) {
                        appendLoc = `address.$.${loc}`
                        setData[appendLoc] = req.body[loc]
                    }
                }
                console.log(setData)
                console.log("1111")
                console.log(req.userData._id)
                console.log(req.body.address_id)
                //console.log(address[0]._id)
                let UpdateProfile = await StaffInfoModel.updateOne({
                    //_id:req.userData._id,

                    "address._id": req.body.address_id

                }
                    , { $set: setData })
                console.log(UpdateProfile)
                if (!UpdateProfile) {
                    return res.send('Location Not Updated ')
                }
                return res.send(UpdateProfile)
            }

        } catch (e) {
            console.log(e)
            return res.send(e)
        }
    }
)


// app.post("/uploadphoto",upload.single('myImage'),(req,res)=>{
//     var img = fs.readFileSync(req.file.path);
//     var encode_img = img.toString('base64');
//     var final_img = {
//         contentType:req.file.mimetype,
//         image:new Buffer(encode_img,'base64')
//     };
//     imageModel.create(final_img,function(err,result){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(result.img.Buffer);
//             console.log("Saved To database");
//             res.contentType(final_img.contentType);
//             res.send(final_img.image);
//         }
//     })
// })
// app.post("/setDefaultAddress",verifyToken,
//     body('address_id').exists().notEmpty().trim().withMessage('Location Id  Required.'),
//     async (req, res) => {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                res.send("Please Enter Required Field")

//             } else {
//                 console.log(req.userData._id)
//                 //  console.log(req.body)

//                 let resetFalse = await StaffInfoModel.updateOne({poster_id: req.userData._id},
//                     {$set: {"address.$[].is_default": false}})
//                     console.log(resetFalse)
//                 let setDefault = await StaffInfoModel.updateOne({
//                         //poster_id: req.userData._id,
//                         "address._id": req.body.address_id
//                     },
//                     {
//                         $set: {"address.$.is_default": 1}
//                     })

//                 if (!setDefault) {
//                     return res.send('Default Location Not Updated ')
//                 }
//                 return res.send('Default Location Set')
//             }
//         } catch (e) {
//             return res.send( e)

//         }
//     }
// )


app.post("/addQualification", verifyToken, [
    body('degree_name').exists().notEmpty().trim().withMessage('Degree Name  is required.'),
    body('start_date').exists().notEmpty().trim().withMessage('Start Date is required.'),
    body('end_date').exists().notEmpty().trim().withMessage('End Date is required.'),
    body('location').exists().notEmpty().trim().withMessage('Location is required.'),
    body('total_year').exists().notEmpty().trim().withMessage('Total Year is required.'),
    body('university_name').exists().notEmpty().trim().withMessage('University Name is required.'),
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors)
                res.send("Please Enter Required Field")

            } else {
                let insertEducation = {
                    degree_name: req.body.degree_name,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    location: req.body.location,
                    total_year: req.body.total_year,
                    university_name: req.body.university_name,

                }
                console.log(insertEducation)
                console.log(req.userData._id)
                let addEducation = await StaffInfoModel.updateOne(
                    {
                        user_id: req.userData._id
                    },
                    { $push: {qualification: insertEducation } }
                )

                res.send({
                    sucess: 1,
                    message: "Qualification added successfully",
                    qualification: insertEducation
                })

                  
                     console.log(addEducation)


            }
        } catch (e) {
            console.log(e)

            return res.send(e)

        }

    }
)

app.post('/basic_info_clinic',verifyToken,[
    body('service').exists().notEmpty().trim().withMessage('line1 Is Required.'),
    body('logo').exists().notEmpty().trim().withMessage('line2  is required.'),
    //body('clinic_locatiom').exists().notEmpty().trim().withMessage('city is required.'),
] ,upload.single('logo'),async(req,res)=>{

    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     console.log(errors)
        //     res.send("Please Enter Required Field")

        // } else {
            console.log(req.file.filename)
            let insertData = {
                service: req.body.service,
                logo: req.file.filename,
                

            }
            console.log(insertData)
            let checkExistProfile = await ClinicInfoModel.findOne({ user_id: req.userData._id })
            if (!checkExistProfile) {
                let UpdateProfile = await ClinicInfoModel.updateOne({ user_id: req.userData._id }, { $set: insertData })
                ClinicInfoModel.create(insertData)
    
                res.send({
                    sucess: 1,
                    logo: `http://192.168.1.17:5000/${req.file.filename}`,
                    ClinicDetails: insertData
                })
            } else {
                res.send("user already exist")
            }


        
        
    } catch (error) {
        console.log(error)
        res.send(error)
        
    }

})


app.post("/addClinicLocation", verifyToken, [
    body('line1').exists().notEmpty().trim().withMessage('line1 Is Required.'),
    body('line2').exists().notEmpty().trim().withMessage('line2  is required.'),
    body('city').exists().notEmpty().trim().withMessage('city is required.'),
    body('country').exists().notEmpty().trim().withMessage('country is required.'),
    body('postal_code').exists().notEmpty().trim().withMessage('postalCode is required.')
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.send("Please Enter Required Field", errors.array())

            } else {
                let locationData = {
                    line1: req.body.line1,
                    line2: req.body.line2,
                    district: req.body.district,
                    city: req.body.city,
                    country: req.body.country,
                    state: req.body.state,
                    postal_code: req.body.postal_code,
                    is_default: req.body.is_default ? req.body.is_default : 0,
                    lat: req.body.lat,
                    lng: req.body.lng,
                    locations_geometry: {
                        type: "Point",
                        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                    }
                }
                console.log(locationData)
                console.log(req.userData._id)
                let insertClinicLocation = await ClinicInfoModel.updateOne(
                    {
                        user_id: req.userData._id
                    },
                    { $push: { clinic_location: locationData } })

                return res.send({
                    sucess: 1,
                    message: "Location added successfully",
                    clinic_location: locationData
                })
            }
        } catch (e) {
            console.log(e)

            return res.send(e)

        }

    }
)





app.post('/postJob',verifyToken,[
   //body('posted_by').exists().notEmpty().withMessage('Posted by is required.'),
    body('job_title').exists().notEmpty().withMessage('Job Title is required.'),
  
    body('job_type').exists().notEmpty().withMessage('Job Type is required.'),
   
    body('year_of_experience').exists().notEmpty().withMessage('Experience Level Is Required.'),
    body('expire_date').exists().notEmpty().withMessage('expire date is required.')],
    async (req, res) => {
        try {
            console.log('1111-----------')
            console.log(req.body)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send( "Please Enter Required Field")

            } else {
                //add check not created

                //to check is company profile creted if not first create company

                let CreateJob = {
                    posted_by: req.userData._id,
                    job_title: req.body.job_title,
                    job_type: req.body.job_type,
                    skills: req.body.skills,
                    expire_date:req.body.expire_date,
                    year_of_experience: req.body.year_of_experience,
                    job_location: req.body.job_location,
                    address_id:req.body.address_id,
                    lat: req.body.lat,
                    lng: req.body.lng,
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                    }

                }

               console.log(CreateJob)
                const post = await PostJobModel.create(CreateJob)
                res.json({
                    "success":"1", 
                    "message":"Job create successful"
                })
                   
            }
        } catch(e) {
           
            console.log(e)
            res.send(e)

        }
    }
)



app.post('/filterOnJobs', async(req,res)=>{
    let page = 1
            if (req.params.page)
                page = parseInt(req.params.page)
            let resPerPage = 4;
            if (req.params.resPerPage) {
                resPerPage = req.params.resPerPage;
                resPerPage = parseInt(resPerPage);
            }
            let skip = resPerPage * page - resPerPage
            const distance = req.body.distance
            let filterJob = await PostJobModel.aggregate([
                {
                    $geoNear: {
                        near: {type: "Point", coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]},
                        key: "location",
                        distanceField: "distance",
                        maxDistance: distance * 1000, 
                        includeLocs: "dist.location",    //2000 * 1000=2000km
                        //distanceMultiplier: 1 / 1000,
                        spherical: true,
                    }
                },
                {$skip: skip},
                    {$limit: resPerPage},
            ])
            console.log(filterJob)

            if (filterJob.length === 0){
            return res.send("No Job Found")
            }else{
             return res.send("Job Found Sucessfully")
            }

            })











app.listen(port, () => {
    console.log(`Connection is setup at ${port}`);
})
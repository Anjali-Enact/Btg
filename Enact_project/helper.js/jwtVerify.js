require('dotenv').config()
const RegisterModel = require('../model/Register')
var jwt = require('jsonwebtoken');
const Response = require('../helper/Response')
module.exports = (async (req, res, next) => {
    try {
        let token = req.headers['authorization']
        if (!token) {
            return Response.UnAuthorized(res, 'UnAuthorized')
        } else {
            var Token = token.split(" ")[1];
            //console.log(Token)
            jwt.verify(Token, process.env.PASSPORT_KEY, async function (err, decoded) {
                if (err)
                    return Response.UnAuthorized(res, err.message)
                // console.log(decoded)
                RegisterModel.findOne({_id: decoded._id})
                    .then((data) => {
                        if (!data) {
                            return Response.NotFound(res, "User not found")
                        } else {
                            req.userData = decoded
                            next()
                        }
                    }).catch((e) => {
                    return Response.InternalServerError(res, e)
                })
            });
        }
    } catch (error) {
        Response.SomethingWentWrong(res, error)
    }
})
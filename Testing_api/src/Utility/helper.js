module.exports = {
    SuccessWithData: (res,message,data) => {
        return res.status(200).json({
            statusCode: 200,
            message: message,
            user_details: data,
        });
    },

    SuccessResponseWithData: (res, msg, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: msg,
            user_details: data,
        });
    },

    SuccessResponseWithOutData: (res, msg) => {
        return res.status(200).json({
            statusCode: 200,
            message: msg,

        });
    },

    FailedResponseWithOutData: (res, msg) => {
        return res.status(400).json({
            statusCode: 400,
            message: msg,

        });
    },

    SomethingWentWrong: (res, e) => {
        return res.status(400).json({
            statusCode: 400,
            message: "Something Went Wrong",
            error: e.message
        });
    },

    UnAuthorized: (res, msg) => {
        return res.status(401).json({
            statusCode: 401,
            message: msg,
        });

    },

    NotFound: (res, msg) => {
        return res.status(404).json({
            statusCode: 404,
            message: msg,
        });
    },

    Duplicate: (res) => {
        return res.status(400).json({
            statusCode: 400,
            message: "Duplicate Email It Is Already Register",
        });
    },

    ValidationError: (res, err) => {
        return res.status(422).json({
            statusCode: 422,
            message: err,
        });
    },

    LoginSuccessFull: (res, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: "Login SuccessFull",
            user_details: data,
        });
    },

    SignUpSuccessFull: (res, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: "SignUp SuccessFull",
            user_details: data,
        });
    },

    LoginFailed: (res, message) => {
        return res.status(400).json({
            statusCode: 400,
            message: message
        });
    }
}

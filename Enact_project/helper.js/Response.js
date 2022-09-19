module.exports ={
    UnAuthorized: (res, msg) => {
        return res.status(401).json({
            statusCode: 401,
            message: msg,
        });

    },

    InternalServerError: (res, e) => {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: e.message,
        });
    },

    validationErrorWithData: (res, message, data) => {
        return res.status(400).json({
            statusCode: 400,
            message: message,
            error: data
        });

    }
}
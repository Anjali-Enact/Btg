const dotenv = require('dotenv').config()
const express = require("express");

//const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('./db/Conn')

  let token = jwt.sign(useremail.toJSON(), "asdfghjklqwertyuiozxcvbn", {
    expiresIn: "100h"
}
)
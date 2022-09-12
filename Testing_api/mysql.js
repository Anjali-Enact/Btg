const mysql = require('mysql');
const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test"
})
conn.connect((error)=>{
    if(error){
        console.log("error")
    }
    else{
        console.log("connected")
    }

})
conn.query("SELECT * from",()=>{
    console.log("result",result)
})
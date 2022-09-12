const mongoose = require("mongoose");

const url =
"mongodb+srv://anjali_verma:Aishwarya%400108@cluster0.bcsidoj.mongodb.net/ecom?retryWrites=true&w=majority";

//"mongodb://anjali_verma:Aishwarya%400108@cluster0-shard-00-00.o0urg.mongodb.net:27017,cluster0-shard-00-01.o0urg.mongodb.net:27017,cluster0-shard-00-02.o0urg.mongodb.net:27017/Tester_api?ssl=true&replicaSet=atlas-mwt6by-shard-0&authSource=admin&retryWrites=true&w=majority";
console.log("111");


  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false

      
    })
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => console.log("Error: ", error));

    module.exports = mongoose;
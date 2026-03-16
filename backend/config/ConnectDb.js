const mongoose = require("mongoose");  


const ConnectDb = async () => { 
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI); 
     
    console.log("Database Connected ok"); 
  } catch (err) {  
    console.log(err);  
  }
};
module.exports = ConnectDb;

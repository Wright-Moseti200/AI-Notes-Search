let mongoose = require("mongoose");
require("dotenv").config();

let mongodb = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/NotesAI`);
        console.log("Database connected successfully");
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports={mongodb}
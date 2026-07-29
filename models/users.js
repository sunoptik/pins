const mongoose=require("mongoose");

const users= new mongoose.Schema({
    login:String,
    password:String,
    role:String,
    createdAt:Date,
    imgUrl:String,
    imgId:String
});

module.exports=mongoose.model("users",users);
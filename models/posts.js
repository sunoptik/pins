const mongoose=require("mongoose");

const posts= new mongoose.Schema({
    createdAt:{
        type:Date
    },
    head:String,
    description:String,
    body:Object,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})

module.exports=mongoose.model("post",posts);
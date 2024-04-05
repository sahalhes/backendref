const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/mongoo")

// const userschema = mongoose.Schema({
//     username: String,
//     name: String,
//     description:String,
//     categories:[],
//     datecreated:{
//         type:Date,
//         default: Date.now()
//     } 
// }) for that mongodb find etc functions

const userSchema = mongoose.Schema({
    username: String,
    password:String,
    secret:String
});

userSchema.plugin(plm);

// module.exports= mongoose.model("user",userschema) // collection where naam for each doc
module.exports= mongoose.model("user",userSchema) // collection where naam for each doc
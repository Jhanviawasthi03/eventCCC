const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    studentnumber: {
        type: Number,
        required: true,
        unique: true,
    },
    Year:{
        type:String,
        required:true,
    },
    Branch:{
        type:String,
        required:true,
    },
    section:{
        type:String,
        required:true,
    },
    residence:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model("User", userSchema);
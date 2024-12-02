const express=require("express");
const router=express.Router();

const{register}=require("../controllers/auth");
const {apiLimiter}=require('../controllers/auth');

router.post("/register",apiLimiter,register);

module.exports=router;


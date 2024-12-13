const axios = require("axios");
const User=require("../models/User.js");
require("dotenv").config();
const nodemailer=require("nodemailer");
const rateLimit = require("express-rate-limit");


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
exports.apiLimiter = apiLimiter;

const secretkey = process.env.RECAPTCHA_SECRET_KEY;

exports.register=async(req,res)=>{
    try{
  const{name,email,gender,studentnumber,Year,Branch, section,residence,recaptchaToken,contact}=req.body;
  

  if (!name || !studentnumber) {
    return res.status(400).json({
      success: false,
      message: "Name and student number are required fields",
    });
  }

  
  if (!studentnumber || isNaN(studentnumber)) {
    return res.status(400).json({
      success: false,
      message: "Student number must be a numeric value.",
    });
  }
  
  const studentnumberStr = studentnumber.toString(); 
  if (!studentnumberStr.startsWith("24") || studentnumberStr.length !== 8) {
    return res.status(400).json({
      success: false,
      message: "Student number must be an 8-digit number starting with '23'.",
    });
  }
  

  
  if (!(contact) ||isNaN(contact))  {
    return res.status(400).json({
      success: false,
      message: "contact should be a number.",
    });
  }
  if(contact.toString().length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Please enter a 10-digit contact number.",
    });
  }
  
      if(!email|| !email.endsWith("@akgec.ac.in")){
        return res.status(400).json({
            success:false,
            message:"please enter a valid email",
        });
      }
    
       if(!section ){
        return res.status(400).json({
            success:false,
            message:"please enter a valid section",
        });
       }
    
       if(!Branch)
       {
        return res.status(400).json({
            success:false,
            message:"required branch",
        });
       }
    
    
       if(!residence){
        return res.status(400).json({
            success:false,
            message:"enter residence",
        });
    }
    
    if(!gender){
      return res.status(400).json({
        success:false,
        message:"enter gender",
      });
    }

    
     try {
       const rresponse = await axios.post(
         `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${recaptchaToken}`
       );
       const data = rresponse.data;
       if (!data.success) {
         return res.status(400).json({
           success: false,
          message: "Failed reCAPTCHA verification",
         });
       }
     } catch (error) {
       console.error("Error during reCAPTCHA verification:", error);
       return res.status(500).json({
         success: false,
         message: "Error during reCAPTCHA verification",
       });
    }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Already regitered",
          });
        }
    

      const user= await  User.create({
        name,email,gender,studentnumber,Year,Branch, section,residence,contact,
      });



      const transporter = nodemailer.createTransport({
        service:"gmail",
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
      });
      const emailTemplate = `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <h2>Welcome to AKGEC Registration</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for registering with us.</p>
        <p>Your registration details:</p>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Branch:</strong> ${user.Branch}</li>
          <li><strong>Year:</strong> ${user.Year}</li>
        </ul>
        <p>Best regards,<br>AKGEC Team</p>
      </div>
    `;
    
    const mailoptions={
      from:process.env.EMAIL_USER,
      to:user.email,
      subject:"sucessfully registered ",
      html:emailTemplate,
      };
     
      transporter.sendMail(mailoptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
        } else {
          console.log('Email sent:', info.response);
        }
      })
    
      return res.status(200).json({
    success:true,
    message:"Succesfully registered",
    user: {
        name: user.name,
        email: user.email,
        Year: user.Year,
        Branch: user.Branch,
        section: user.section,
        residence: user.residence,
        gender:user.gender
      },
    
    });
 }
 catch (error) {
console.error("Error during user registration:", error);
return res.status(500).json({
success: false,
message: "Cannot register, please try again later",
});
}
};

const express=require("express");
const bcrypt=require("bcrypt");
const {UserModel}=require("../models/user.model");
const userRouter=express.Router();
const jwt=require("jsonwebtoken");
userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city}=req.body;
    try{
        const user=await UserModel.findOne({email:email});
        console.log(user);
        if(user){
            return res.status(400).json({msg:"User is already register"})
        }
        bcrypt.hash(password,2,async(err,hash)=>{
            if(err){
                res.status(200).json({error:err});
            }else{
                const user=new UserModel({name,email,gender,password:hash,age,city});
                await user.save();
                console.log(user);
                res.status(200).json({msg:"The new User has been register"});
            }
        });
    }catch{
        res.status(400).json({error:err});
    }
});

//userLogin
userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({email});
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token=jwt.sign(
                    {userID:user._id},
                    "masai",{expiresIn:"7d",}
                );
                res.status(200).json({msg:"Logged in",token});
            }else{
                res.status(200).json({error:err});
            }
        });
    }catch(err){
        res.status(400).json({error:err});
    }
})

//logout
userRouter.get("/logout",async(req,res)=>{
    const token=req.header.authorization?.split("")[1];
    try{
        const blacklist=new BlacklistModel({
            token,
        });
        await blacklist.save();
        res.status(200).json({msg:"User has been logged out"});
    }catch(err){
        res.status(400),json({error:"err"});
        console.log(err)
    }
})


module.exports={
    userRouter,
}
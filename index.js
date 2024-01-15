const express=require("express");
const {connection}=require("./db");
const {userRouter}=require("./routes/user.routes");
const {postRouter}=require("./routes/post.routes");
const {auth}=require("./middleware/auth.middleware");
const app=express();
const cors=require("cors");
app.use(express.json());

app.use("/users",userRouter);
app.use("/posts",postRouter);

 app.get("/",(req,res)=>{
    res.send("Home Page");
 });
 app.listen(8080,async()=>{
    try{
        await connection;
        console.log("Connected to DB");
        console.log("Server is running at port 8080");
    }catch(err){
        console.log(err);
    }
 })

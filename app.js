require('dotenv').config();
const express=require ("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/authUserDB");

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});


console.log(process.env.API_KEY);
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User=mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
})


app.get("/login",function(req,res){
    res.render("login");
})


app.get("/register",function(req,res){
    res.render("register");
})


app.get("/secrets",function(req,res){
    res.render("secrets");
})


app.get("/submit",function(req,res){
    res.render("submit");
})



app.post("/register",function(req,res){
    const userName=req.body.username;
    const password=req.body.password;

    const newUser=new User({
        email:userName,
        password:password
    })

    newUser.save(function(err){
        if(err){
            console.log("err");
        }else{
            res.render("secrets")
        }
    });
    

});


app.post("/login",function(req,res){
    userName=req.body.username;
    password=req.body.password;

    User.findOne({email:userName},function(err,foundUser){
        if(!err){
            if(password===foundUser.password){
                res.render("secrets");
            }else{
                res.render("login");
            }
        }
    })
})

app.listen(3000,function(){
    console.log("server is running on port 3000");
});
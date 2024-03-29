const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view-engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDb", {useNewUrlParser: true});
mongoose.set('strictQuery', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = "Shhh Don't Tell anyone"
userSchema.plugin(encrypt, { secret: secret , encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home.ejs");
})

app.route("/register")
    .get((req,res)=>{
        res.render("register.ejs");
    })
    .post((req,res)=>{
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets.ejs");
            }
        })
    })

app.route("/login")
    .get((req,res)=>{
        res.render("login.ejs");
    })
    .post((req,res)=>{
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({email: username},function(err,foundUser){
            if(err) {
                console.log(err);
            }else{
                if(foundUser){
                    if(foundUser.password === password){
                        res.render("secrets.ejs");
                    }
                }
            }
        })
    });


app.listen(3000,function(){
    console.log("server started");
})
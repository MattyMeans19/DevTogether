import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
var userEmail = "";
var userName = "";
var userPassword = "";
var fullName = "";
var registeredMessage = "";
var errorMessage = "";
var date = new Date();
var posts = [{poster: "Admin", posting: "Welcome to DevTogether! Super exctied to have you here!", postDate: date}];

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  app.use(express.static("public"));

  app.get("/register", (req, res) => {
    res.render("register.ejs");
  });
  app.get("/login", (req, res) => {
    getUser();
    errorMessage = ""
    res.render("login.ejs", {message: errorMessage});
  });
  app.get("/home", (req, res) => {
    getUser();
    console.log(userName);
    console.log(fullName);
    res.render("home.ejs", {CurrentUser: userName, FullName: fullName, availablePosts: posts});
  });
  app.get("/messages", (req, res) => {
    res.render("messages.ejs");
  });
  app.get("/support", (req, res) => {
    res.render("support.ejs");
  });
  app.get("/editprofile", (req, res) => {
    res.render("editprofile.ejs");
  });

  app.post("/submit", (req, res) => {
    userEmail = req.body["UserEmail"];
    userName = req.body["UserName"];
    userPassword = req.body["UserPassword"];
    fullName = req.body["fName"]+ " " + req.body["lName"];
    registeredMessage = "Successfully registered! Please go to Login page."
    fs.writeFile('UserName.txt', userName, (err) => {
      if (err) throw err;
    });
    fs.writeFile('Password.txt', userPassword, (err) => {
      if (err) throw err;
    });
    fs.writeFile('FullName.txt', fullName, (err) => {
      if (err) throw err;
    });
    console.log(userEmail);
    console.log(userName);
    console.log(userPassword);
    console.log(fullName);

    res.render("register.ejs", {registerMessage: registeredMessage});
  });

  app.post("/logging", (req, res) => {
   let currentUser = req.body["UserName"];
   let currentPassword = req.body["Password"];

   fs.readFile('UserName.txt', 'utf8', function (err, data){
      userName = data;
   });

   if(currentPassword != userPassword && currentUser != userName){
    errorMessage = "Incorrect UserName or Password."
    res.render("login.ejs", {message: errorMessage});
   }
   else{
    errorMessage = ""
    res.render("home.ejs", {CurrentUser: userName, FullName: fullName, availablePosts: posts});
   }
  });


  app.post("/save", (req, res) => {
    userEmail = req.body["UserEmail"];
    userPassword = req.body["UserPassword"];
    fullName = req.body["fName"]+ " " + req.body["lName"];
    fs.writeFile('Password.txt', userPassword, (err) => {
      if (err) throw err;
    });
    console.log(userEmail);
    console.log(userName);
    console.log(userPassword);
    console.log(fullName);

    res.render("editprofile.ejs");
  });

  app.post("/newpost", (req, res) => {
    let newPost = req.body["newMessage"];
    makePost(userName, newPost);
    res.render("home.ejs", {CurrentUser: userName, FullName: fullName, availablePosts: posts});
  });

  app.listen(process.env.PORT || 3000);


  function getUser(){
    fs.readFile('UserName.txt', 'utf8', function (err, data){
      userName = data;
      return;
  });
    fs.readFile('FullName.txt', 'utf8', function (err, data){
      fullName = data;
      return;
  }); 
  }

  function makePost(userName, postMessage){
    var datePosted = new Date();
    var newPost = {poster: userName, posting: postMessage, postDate: datePosted};
    posts.push(newPost);
    postMessage = "";
  }

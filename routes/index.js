var express = require('express');
var router = express.Router();
const userModel = require("./users");
const { default: mongoose } = require('mongoose');

const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()))

//cookie
router.get('/', function(req, res) {
  req.session.anythingname="helo";
  req.session.ban=true; //ban true like any name
  res.render('index');
});
router.get('/checkban', function(req, res) {
  if(req.session.ban==true) res.send("Banned");
  else res.send("Not banned")
});
router.get('/removeban', function(req, res) {
  req.session.destroy(function(err){
    if(err) throw err;
    res.send("unbanned");
  })
});

//session

router.get('/cook', function(req, res) {
  res.cookie("age",25);
  res.send("saved");
});
router.get('/readcook', function(req, res) {
  console.log(req.cookies);
  res.send("check console");
});
router.get('/deletecook', function(req, res) {
  res.clearCookie("age");
  res.send("cleared");
});

//flash
router.get('/failed', function(req, res) {
  req.flash("age",12);
  res.send("done")
});
router.get('/checkfailed', function(req, res) {
  console.log(req.flash("age"));
  res.send("check")
});

router.get('/create', async function(req, res) {

  const created = await userModel.create({ //asynchronous , execute at last. so use await. but for await use async
    username: "siuu",
    age: 19,
    name: "Ronaldo"
  })
  res.send(created);
});
router.get('/oneuser', async function(req, res) {
  let alluser = await userModel.findOne({username: "siuu"});
  res.send(alluser);
});
router.get('/allusers', async function(req, res) {
  let alluser = await userModel.find();
  res.send(alluser);
});
router.get('/delete', async function(req, res) {
  let deleteduser = await userModel.findOneAndDelete({
    username:"siuu"
  });
  res.send(deleteduser);
});



router.get("/case",async function(req,res){
  let userdata = await userModel.create({
    username: "hahaaaa",
    name: "hrrehe",
    description:"fashion",
    categories:['js','smile','football'],
  })
  res.send(userdata);
});
//case insensitive search

router.get("/find",async function(req,res){
  var regex = new RegExp("^haha$",'i'); // ^ start from here $ end here
  let user = await userModel.find({username : regex});
  res.send(user);
});

//key word search
router.get("/findkey",async function(req,res){
  let user = await userModel.find({categories : {$all:['js']}});
  res.send(user);
});

//doc within date range
router.get("/finddate",async function(req,res){
  var date1 = new Date('2024-4-5'); 
  var date2 = new Date('2024-4-6'); 
  let user = await userModel.find({datecreated : {$gte:date1,$lte:date2}});
  res.send(user);
});

//existence of field
router.get("/findexist",async function(req,res){
  let user = await userModel.find({categories : {$exist:true}});
  res.send(user);
});

//field length
router.get("/findfield",async function(req,res){
  let user = await userModel.find({
    $expr : {
      $and:[
        {$gte: [{$strLenCP:'$username'},0] },
        {$lte:  [{$strLenCP:'$username'},5] }
      ]
    }
  });
  res.send(user);
});


//authorization and authentication

router.get("/profile", isLoggedIn, function(req, res) {
  res.render('profile');
});

router.get("/register", function(req, res) {
  res.render('index'); // Assuming you have a register.ejs or register.hbs file for rendering the registration form
});

router.post('/register', function(req, res) {
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret // Assuming you have a field called 'secret' for registration
  })
  userModel.register(userdata, req.body.password)
    .then(function(registereduser) {
      passport.authenticate("local")(req, res, function() {
        res.redirect('/profile');
      });
    })
    .catch(function(err) {
      console.log(err); // Handle registration errors appropriately
      res.redirect('/register'); // Redirect back to the registration page in case of an error
    });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}));

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;

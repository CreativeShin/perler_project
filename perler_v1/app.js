var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// models

var Test = require('./models/temp.js');
mongoose.connect("mongodb://localhost/temp", {
   useMongoClient:true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
// Root Route

app.get('/', function(req, res){
   // res.send("Home");
   Test.create({
         name: "PikaPika",
         image: "String",
         description: "Shiney"
      
   }, function(error, returnedTest){
      if(error){
         console.log(error)
      }else{
         // console.log(returnedTest);
         res.render('index', {
            output: returnedTest
         })
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running..."); 
});
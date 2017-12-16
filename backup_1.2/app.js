var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

mongoose.connect("mongodb://localhost/temp", {
   useMongoClient:true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Models
var Post = require('./models/post.js');


// Root Route

app.get('/', function(req, res){
   Post.find({}, function(error, foundPosts){
     if(error){
        console.log(error);
     }else{
         res.render('index', {
         posts: foundPosts
      });
     }
   });
});

// New Post

app.get('/new', function(req, res){
   res.render('new');
});

// Create Route

app.post('/', function(req, res){
   var name = req.body.name,
      image = req.body.image,
description = req.body.description;

      Post.create({
         name: name,
         image: image,
         description
      }, function(error, createdPost){
         if(error){
            console.log(error);
         }else{
            console.log(createdPost);
            res.redirect('/');
         }
      });
});

// SHOW Route


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running..."); 
});
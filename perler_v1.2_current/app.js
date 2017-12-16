var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

mongoose.connect("mongodb://localhost/perler_v12", {
   useMongoClient:true
});

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

// Models
var Post = require('./models/post.js');


// Root Route

app.get('/', function(req, res){
   res.redirect('/posts');
});

// Posts Route
app.get('/posts', function(req, res){
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

app.post('/posts', function(req, res){
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
            res.redirect('/posts'); //default is get request
         }
      });
});

// SHOW Route

app.get('/posts/:id', function(req, res){
   console.log(req.params.id);
    console.log(mongoose.Types.ObjectId.isValid(req.params.id));
   Post.findById( req.params.id, function(error, foundPost){
  
      if(error){
         console.log(error);
      }else{
         res.render('show', {
         post: foundPost
      });
      }
   });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running..."); 
});
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

mongoose.connect("mongodb://localhost/perler_v12", {
   useMongoClient:true
});

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

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

// EDIT Route
app.get('/posts/:id/edit', function(req, res){
   Post.findById(req.params.id, function(error, foundPost){
      if(error){
         console.log(error);
      }else{
         res.render('edit',{
            post:foundPost 
   });
      }
   });
   // res.send('working');
 
});

// UPDATE Route // DEBUG

app.post('/posts/:id', function(req, res){
   var name = req.body.name,
      image = req.body.image,
      description = req.body.description;
   Post.findByIdAndUpdate(req.params.id,{
         name: name,
         image: image,
         description: description
            
      } , function(error, updatedPost){
      if(error){
         console.log(error);
      }else{
         console.log(updatedPost);
         res.redirect('/');
      }
   });
});

// Delete Route
app.post('/posts/:id/delete', function(req, res){
   var delId = req.params.id;
   Post.findByIdAndRemove(delId, function(error, deleted){
      if(error){
         console.log('error');
      }else{
         console.log(deleted);
         res.redirect('/');
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running..."); 
});
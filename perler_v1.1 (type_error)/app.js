var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// models

var Post = require('./models/post.js');
mongoose.connect("mongodb://localhost/post", {
   useMongoClient:true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


// Root Route

app.get('/', function(req, res){
   // res.send("Home");
   Post.find({}, function(error, returnedPosts){
      if(error){
         console.log(error);
      }else{
         // console.log(returnedPosts);
         res.render('index', {
            posts: returnedPosts
         });
      }
   });
   
});

app.get('/admin', function(req, res){
   res.render('admin');
});


// SHOW route

app.get('/:id', function(req, res){
   // res.send(req.params.id);
   Post.findById(req.params.id, function(error, returnedPost){
      res.render('show', {
         post: returnedPost
      });   
   });
      
});

// EDIT route 

app.get('/:id/edit', function(req, res){
   var postId = req.params.id;
   Post.findById(postId, function(error, returnedPost){
      res.render('edit', {
         post: returnedPost
      });
   });
});

// Creating Posts

app.post('/', function(req,res){
   // console.log(req.body);
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   Post.create({
      name: name,
      image: image,
      description: description
   }, function(error, returnedPost){
      if(error){
         console.log(error);
      }else{
         // console.log(returnedPost);
         res.redirect('/');
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running..."); 
});
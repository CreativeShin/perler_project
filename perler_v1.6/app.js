var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');
var app = express();

// Models
var Post = require('./models/post.js');
var User = require('./models/user.js');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/perler_v16", {
   useMongoClient:true
});

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(session({
   secret: "thisisperler",
   resave: false,
   saveUninitialized: false
}));


// PassportConfig
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


passport.use(new LocalStrategy(User.authenticate()));

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
         posts: foundPosts,
         admin: req.user
      });
     }
   });
});

// New Post

app.get('/new',isLoggedIn, function(req, res){
   res.render('new',{admin: req.user});
});

// Create Route

app.post('/posts', isLoggedIn, function(req, res){
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
         // console.log(req.user);
         res.render('show', {
         post: foundPost,
         admin: req.user
      });
      }
   });
});

// EDIT Route
app.get('/posts/:id/edit',isLoggedIn, function(req, res){
   Post.findById(req.params.id, function(error, foundPost){
      if(error){
         console.log(error);
      }else{
         res.render('edit',{
            post:foundPost, 
            admin: req.user
   });
      }
   });
   // res.send('working');
 
});

// UPDATE Route // DEBUG

app.post('/posts/:id',isLoggedIn, function(req, res){
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
app.post('/posts/:id/delete',isLoggedIn, function(req, res){
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

// PASSPORT

app.get('/about', function(req, res){
   res.render('about',{admin: req.user});
});


app.get('/register', function(req, res){
   res.render('register',{admin: req.user});
});

app.get('/login', function(req, res){
   res.render('login',{admin: req.user});
});


app.post('/register', function(req, res){
   User.register(new User({username: req.body.username}), req.body.password, function(error, user){
      if(error){
         return res.render('register');
      }
      passport.authenticate('local')(req, res, function(){
         res.redirect('/new');
      });
   });
});

app.post('/login',passport.authenticate('local',{
   successRedirect: '/new',
   failureRedirect: '/'
}), function(req, res){
   res.render('login');
});

app.get('/logout', function(req, res){
   req.logout();
   res.redirect('/');
});

// MIDDLEWARE

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is running..."); 
});
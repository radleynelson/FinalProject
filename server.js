// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result) {
      let token = jwt.sign({ id: user.id }, jwtSecret, {
	expiresIn: '24h' // expires in 24 hours
      });
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id},token:token});
    } else {
      res.status(403).send("Invalid credentials");
    }
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

//Registration

app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({email: req.body.email, hash: hash, username:req.body.username,
				 name:req.body.name, role: 'user'});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    let token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: '24h' // expires in 24 hours
    });
    res.status(200).json({user:user,token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  knex('users').where('id',req.userID).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});


app.get('/api/users/:id/posts', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('posts','users.id','posts.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('post','username','name','created','posts.id','title','image').then(tweets => {
      res.status(200).json({tweets:tweets});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

//Get Single Post content
app.get('/api/users/:userid/post/:postid', (req, res) => {
  let id = parseInt(req.params.postid);
  knex('posts').where('id',id).first().select('post','title').then(post => {
    res.status(200).json({post:post})
  }).catch(error => {
    res.status(500).json({error})
  })
});

//Get Single Post Generally for public
app.get('/api/post/:postid', (req, res) => {
  let id = parseInt(req.params.postid);
  knex('posts').join('users','posts.user_id','users.id').where('posts.id',id).first().select('post','title','image','created','name','username').then(post => {
    res.status(200).json({post:post})
  }).catch(error => {
    res.status(500).json({error})
  })
});

app.put('/api/users/:userid/post/:postid', (req,res) => {
  let id = parseInt(req.params.postid);
  let postContent = req.body.post;
  console.log(req.body.post);

  knex('posts')
.where('id',id).first()
.update({
  post: postContent
}).then(post => {
  res.status(200).json({post: "All Good"})
}).catch(err => {
  console.log(err);
  res.status(500).json({error})
})
  // knex('posts').where('id',id).first().update({post: req.body.post}).then(ids =>{
  //   return knex('posts').where('id',ids[0]).first();
  // }).then(tweet => {
  //   res.status(200).json({post: "All good in the hood"});
  //   return
  // }).catch(error => {
  //   console.log(error);
  //   res.status(500).json({error})
  // })
});

app.get('/api/posts', (req, res) => {
  knex('posts').select('post', 'id', 'created','title','image').then(posts => {
    res.status(200).json({posts:posts})
  }).catch(err => {
    res.status(500).json({error})
  })
})

app.post('/api/users/:id/posts', (req, res) => {
  let id = parseInt(req.params.id);
  let defaultPost = "Enter your content here";
  let defaultImage = "blank";
  knex('users').where('id',id).first().then(user => {
    return knex('posts').insert({user_id: id, post: req.body.post, title: req.body.title, image:req.body.image, created: new Date()});
  }).then(ids => {
    return knex('posts').where('id',ids[0]).first();
  }).then(post => {
    res.status(200).json({post:post});
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.delete('/api/post/:postid', (req, res) => {
  let id = parseInt(req.params.postid);
  knex('posts').where('posts.id',id).first().del().then(post => {
    res.status(200).json({post:post})
  }).catch(error => {
    res.status(500).json({error})
  })
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

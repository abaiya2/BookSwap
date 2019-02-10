const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    city: '',
    state: '',
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: 'Failed to Register User'});
    } else {
      res.json({success: true, msg: 'User Successfully Registered'});
    }
  });
});

router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({success: false, msg: 'User Not Found'});
    }
    User.comparePassword(password, user.password, (error, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 Week
        });
        res.json({
          success: true,
          token: 'Bearer ' + token,
          msg: 'Successfully Logged In'
        });
      }
    })
  });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});

router.post('/addBook', (req, res, next) => {
  var userId = req.body.userId;
  var book = req.body;
  //console.log(book);
  User.update({
    _id: userId
    }, {
    $push: {
      books: book
    }
  }, (err) => {
    if (err) {
      res.json({success: false, msg: 'Error Adding Book'});
    }
    else {
      res.json({success: true, msg: 'Successfully Added Book'});
    }
  });
});

router.get('/getBooks', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user.books});
});

router.get('/getAllBooks', (req, res) => {
  User.find({}, 'books').lean().exec(function(err, doc) {
    res.json({books: doc});
  });
});

router.get('/getIncomingRequests', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({requests: req.user.incomingRequests});
});

router.get('/getOutgoingRequests', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({requests: req.user.outgoingRequests});
});

router.post('/requestTrade', (req, res) => {
  var requesterId = req.body.requesterId;
  var ownerId = req.body.ownerId;
  var bookInfo = {
    bookId: req.body.bookId,
    title: req.body.title,
    imgLink: req.body.imgLink,
    pageCount: req.body.pageCount,
    owner: ownerId,
  };
  var bookRequester = {
    bookId: req.body.bookId,
    title: req.body.title,
    imgLink: req.body.imgLink,
    pageCount: req.body.pageCount,
    requester: requesterId,
  }
  User.update({
    _id: requesterId
    }, {
    $push: {
      outgoingRequests: bookInfo,
    }
  }, (err) => {
    if (err) {
      console.log('ERROR');
    } else {
      console.log('NO ERROR');
    }
  });
  User.update({
    _id: ownerId
    }, {
    $push: {
      incomingRequests: bookRequester,
    }
  }, (err) => {
    if (err) {
      console.log('ERROR');
    } else {
      console.log('NO ERROR');
    }
  });
});

router.post('/validateTrade', (req, res) => {
  var book = {
    title: req.body.title,
    userId: req.body.requesterId,
    bookId: req.body.bookId,
    imgLink: req.body.imgLink,
    pageCount: req.body.pageCount,
  }
  console.log(req.body);
  console.log(book);
  User.update({
    _id: req.body.ownerId
  }, {
    $pull: {
      books: {bookId: req.body.bookId}
    }
  }, (err, data) => {

  });
  User.update({
    _id: req.body.ownerId
  }, {
    $pull: {
      incomingRequests: {bookId: req.body.bookId}
    }
  }, (err, data) => {

  });
  User.update({
    _id: req.body.requesterId
  }, {
    $push: {
      books: book
    }
  }, (err, data) => {

  });

  User.update({
    _id: req.body.requesterId
  }, {
    $pull: {
      outgoingRequests: {bookId: req.body.bookId}
    }
  }, (err, data) => {

  });

});

router.post('/cancelTrade', (req,res) => {
  console.log(req.body);
  User.update({
    _id: req.body.ownerId
  }, {
    $pull: {
      incomingRequests: {bookId: req.body.bookId, requester: req.body.requesterId}
    }
  }, (err, data) => {
    console.log(data);
  });
  User.update({
    _id: req.body.requesterId
  }, {
    $pull: {
      outgoingRequests: {bookId: req.body.bookId, owner: req.body.ownerId}
    }
  }, (err, data) => {
  });
});

module.exports = router;

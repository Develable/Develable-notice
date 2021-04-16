const express = require('express');
const router = express.Router();

const store = require('store');

router.get('/', async (req, res) => {
  if (!store.get('userPIURL')) {
    res.redirect('/login');
  } else {
    res.render('send', {userCode : store.get('userTag'), userProfile : store.get('userPIURL')});
    //res.render('sendTest', {userCode : 'asdf#1234', userProfile : '/images/Logo_Develable.jpg'});
  }
});

module.exports = router;

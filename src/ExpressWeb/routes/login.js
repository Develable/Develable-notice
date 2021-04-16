const express = require('express');
const router = express.Router();
const path = require('path');
const store = require('store');

router.get('/', (req, res) => {
  store.remove('userTag');
  store.remove('userPIURL');
  store.remove('submitCode');
  res.render('login');
});

router.use(express.static(path.join(__dirname,'/')));

module.exports = router;

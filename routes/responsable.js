const express = require('express');
const route = express.Router();

const reponsableControllers = require('../controllers/responsable')

const {check} = require('express-validator')

route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('tel')
.not()
.isEmpty(),
check('adresse')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, reponsableControllers.signup)

route.post('/login', 
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, reponsableControllers.login)

route.get('/',reponsableControllers.getuser)


module.exports = route
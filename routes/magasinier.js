const express = require('express');
const route = express.Router();

const magasinierControllers = require('../controllers/magasinier')

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
.normalizeEmail()
, magasinierControllers.signup)

route.post('/login', 
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, magasinierControllers.login)

route.get('/',magasinierControllers.getmagasinier)
route.get('/:id',magasinierControllers.getmagasinierById)

route.patch('/:id', 
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
.normalizeEmail()
, magasinierControllers.updatemagasinier)

route.delete('/:id',magasinierControllers.deletemagasinier)




module.exports = route
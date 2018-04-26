const express = require('express');
const materias = require('../controllers/materias.controller');
const auth = require('../authorization');

const router = express.Router();

router.get('/', auth, materias.getByCarrera);
router.get('/materia', materias.getByIndex);
module.exports = router;

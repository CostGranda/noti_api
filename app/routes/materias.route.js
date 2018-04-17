const express = require('express');
const materias = require('../controllers/materias.controller');

const router = express.Router();

router.get('/', materias.getByCarrera);
router.get('/materia', materias.getByIndex);
module.exports = router;

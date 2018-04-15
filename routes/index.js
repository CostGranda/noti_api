const express = require('express');
const materias = require('../controllers/materias.controller');

const router = express.Router();

router.get('/', materias.list);

module.exports = router;

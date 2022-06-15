const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { getStores, createStore } = require('../controllers/stores');
const auth = require('../middleware/auth');


router.use(express.json());

router.get('/stores', auth, getStores);


//Falta validar datos
router.post('/stores', auth, createStore);

module.exports = router;

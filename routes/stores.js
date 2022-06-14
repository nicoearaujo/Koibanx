const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { getStores } = require('../controllers/stores');
const auth = require('../middleware/auth');
// const validation = require('../middleware/validation');

router.get('/stores', auth, getStores);

module.exports = router;

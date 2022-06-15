const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const { getStores, createStore } = require('../controllers/stores');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Store = require('../models/store');


router.use(express.json());

router.get('/stores', auth, getStores);


router.post('/stores',
    body('name')
        .custom(async value => {
            if (await Store.findOne({ name: value })) {
                return Promise.reject('Store already exists');
            }
        })
        .notEmpty().withMessage('Name is required'),
    body('cuit')
        .notEmpty()
        .withMessage('Cuit is required'),
    body('concepts')
        .isArray({ min: 6, max: 6 }).withMessage('Concepts is required, and has to be an array with 6 elements'),
    body('currentBalance')
        .notEmpty().withMessage('Current balance is required')
        .isNumeric().withMessage('Current balance has to be a number'),
    body('active')
        .isBoolean().withMessage('Active has to be a boolean')
        .notEmpty().withMessage('Last sale is required'),
    body('lastSale')
        .isDate().withMessage('Last sale has to be a date')
        .notEmpty().withMessage('Last sale is required'),
    (req, res, next) => {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({
                errors: validationResult(req).array()
            });
        }
        next();
    }
    , auth, createStore);

module.exports = router;

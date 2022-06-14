const Store = require('../models/store');
const formatter = require('../utils/formatter');


const getStores = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const stores = await formatter(page, limit)
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = { getStores }
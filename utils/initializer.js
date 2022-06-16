const User = require('../models/user')
const logger = require('../utils/logger')
const Store = require('../models/store')


exports.init = async function () {
    if (await User.countDocuments({ "username": "test@koibanx.com" })) {
        return
    }

    let user = new User();
    user.username = "test@koibanx.com";
    user.password = "test123";
    await User.create(user);
    logger.info("Test User created")


    for (let i = 0; i < 20; i++) {

        const store = {
            "name": "Test" + i,
            "cuit": "1995743 -" + Math.round(Math.random() * 10),
            "concepts": [Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10)],
            "currentBalance": Math.random() * 10000,
            "active": Boolean(Math.round(Math.random())),
            "lastSale": "2022-06-14T06:17:09Z"
        }
        Store.create(store);
    }
    logger.info("Test Stores created")



}

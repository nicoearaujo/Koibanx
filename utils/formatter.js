const Store = require('../models/store');


const formatter = async (page, limit) => {
    const stores = await Store.find().limit(parseInt(limit)).skip(parseInt(page - 1) * parseInt(limit));
    const total = await Store.countDocuments()
    const pages = Math.ceil(total / limit);
    const formattedStores = stores.map(store => {
        const formattedStore = {
            id: store.id,
            name: store.name,
            balance: store.currentBalance, //Agregar formateo a currency
            cuit: store.cuit,
            active: store.active ? 'Si' : 'No',
            lastSale: store.lastSale.toLocaleString("es-AR"),
        }
        return formattedStore
    })

    return {
        formattedStores,
        page,
        pages,
        limit,
        total
    }
}

module.exports = formatter;
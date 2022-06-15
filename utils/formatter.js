const Store = require('../models/store');


const formatter = async (page, limit) => {
    const stores = await Store.find().limit(parseInt(limit)).skip(parseInt(page - 1) * parseInt(limit));

    //Calculos de total y pages
    const total = await Store.countDocuments()
    const pages = Math.ceil(total / limit);

    //Formateo a currency
    const formattedStores = stores.map(store => {
        var formatter = new Intl.NumberFormat("es-AR", {
            style: 'currency',
            currency: 'UYU',
        });

        const balanceFormatted = formatter.format(store.currentBalance);
        const formattedStore = {
            id: store.id,
            name: store.name,
            balance: balanceFormatted,
            cuit: store.cuit,
            active: store.active ? 'Si' : 'No',
            lastSale: store.lastSale.toLocaleString("es-AR")
        }

        store.concepts.forEach((concept, i) => {
            formattedStore['concept ' + (i + 1)] = concept
        })

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
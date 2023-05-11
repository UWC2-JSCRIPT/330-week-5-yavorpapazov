const Order = require('../models/order');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (item) => {
    const created = await Order.create(item);
    return created
}

module.exports.getById = async (itemId) => {
    const item = await Item.findOne({ _id: itemId }).lean();
    return item
}

// module.exports.getAll = async () => {
//     const items = await Item.find().lean();
//     return items
// }
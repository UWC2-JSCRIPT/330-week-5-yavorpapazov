const Order = require('../models/order');
const Item = require('../models/item');

module.exports = {};

module.exports.getItemById = async (itemId) => {
    const item = await Item.findOne({ _id: itemId }).lean();
    return item
}

module.exports.createOrder = async (item) => {
    const created = await Order.create(item);
    return created
}

// module.exports.getAll = async () => {
//     const items = await Item.find().lean();
//     return items
// }
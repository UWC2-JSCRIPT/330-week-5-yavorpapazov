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

module.exports.getAllByUserId = async (userId) => {
    const orders = await Order.find({ userId }).lean();
    return orders
}

module.exports.getAll = async () => {
    const orders = await Order.find().lean();
    return orders
}
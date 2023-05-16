const Order = require('../models/order');
const Item = require('../models/item');
const mongoose = require('mongoose');

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

module.exports.getOrderById = async (orderId) => {
    const order = await Order.findOne({ _id: orderId }).lean();
    const items = await Item.find({ _id: { $in: order.items } }).lean();
    const itemList = [];
    for(let i of order.items) {
        const itemObj = items.find(item => item._id.toString() === i.toString());
        itemList.push(itemObj)
    }
    order.items = itemList;
    return order
}
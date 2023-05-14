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
    return order
}

module.exports.getOrderByIdAndUserId = async (orderId, userId) => {
    //const order = await Order.findOne({ _id: orderId, userId }).lean();
    const order = await Order.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(orderId), userId: new mongoose.Types.ObjectId(userId) } },
        { $lookup: {
            from: "items",
            localField: "items",
            foreignField: "_id",
            as: "items"
        }}
    ])
    //console.log(order)
    return order
}
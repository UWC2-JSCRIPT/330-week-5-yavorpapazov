const Item = require('../models/item');

module.exports = {};

module.exports.getById = async (itemId) => {
    const item = await Item.findOne({ _id: itemId }).lean();
    return item
}

module.exports.getAll = async () => {
    const items = await Item.find().lean();
    return items
}

module.exports.createItem = async (item) => {
    const created = await Item.create(item);
    return created
}

module.exports.updateById = async (itemId, newObj) => {
    await Item.updateOne({ _id: itemId }, newObj);
    return true
  }
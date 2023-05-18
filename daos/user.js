const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userData, userEmail) => {
  const exist = await User.findOne({ email: userEmail }).lean();
  if (exist) {
    return 'exists'
  }
  const created = await User.create(userData);
  return created
}

module.exports.getUser = async (userEmail) => {
  const user = await User.findOne({ email: userEmail }).lean();
  return user
}

module.exports.updateUserPassword = async (userId, password) => {
  await User.updateOne({ _id: userId }, { password });
  return true
}
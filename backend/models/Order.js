// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('orders', {
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  orderDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: DataTypes.STRING,

  address: DataTypes.TEXT,
  pincode: DataTypes.STRING,
  deliveryperson: DataTypes.STRING,
});

module.exports = Order;
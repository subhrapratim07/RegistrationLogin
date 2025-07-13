// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Order = require('./Order');

const OrderItem = sequelize.define('order_items', {
  item: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// Set associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = OrderItem;
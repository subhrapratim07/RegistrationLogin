// models/Item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Item = sequelize.define('items', {
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT  // base64 string
  }
});

module.exports = Item;

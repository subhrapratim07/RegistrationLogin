// models/BookTable.js
/*const mongoose = require('mongoose');

const BookTableSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  guests: Number,
  date: String,
  time: String,
});

const BookTableModel = mongoose.model('book_table', BookTableSchema);

module.exports = BookTableModel;*/
// models/BookTable.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BookTable = sequelize.define('book_table', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  guests: DataTypes.INTEGER,
  date: DataTypes.STRING,
  time: DataTypes.STRING,
});

module.exports = BookTable;

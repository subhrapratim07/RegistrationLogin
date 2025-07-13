/*onst mongoose = require('mongoose');
const FormDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  phonenumber: String,
  password: String
});
module.exports = mongoose.model('log_reg_form', FormDataSchema);*/


// models/FormData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const FormData = sequelize.define('log_reg_form', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  phonenumber: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = FormData;

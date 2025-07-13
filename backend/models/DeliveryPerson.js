const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const DeliveryPerson = sequelize.define('deliverypersons', {
  DeliveryPerson_ID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Vehicle_No: {
    type: DataTypes.STRING,
    allowNull: false
  },
  AreaCode: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = DeliveryPerson;

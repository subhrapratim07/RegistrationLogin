// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cravory', 'postgres', 'Subhra@1234', {
  host: 'localhost', // or your PostgreSQL server URL
  dialect: 'postgres',
  port: 40000,
});

module.exports = sequelize;

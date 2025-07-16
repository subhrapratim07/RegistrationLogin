const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres.xquycdvpgkaritddpqwp', 'Subhra@1234', {
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;

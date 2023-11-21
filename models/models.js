const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(1000),
    },
    role: {
      type: DataTypes.STRING(),
      defaultValue: 'USER',
    },
  },
  {
    tableName: 'user',
  }
);

module.exports = {
  User,
};

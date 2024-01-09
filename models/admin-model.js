const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Admin = sequelize.define(
  'admin',
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
      defaultValue: 'ADMIN',
    },
  },
  {
    tableName: 'admin',
  }
);

const AdminToken = sequelize.define('admin-token', {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id', // Refers to a field  'id' in the model Admin
    },
  },
  refreshToken: {
    type: DataTypes.STRING(1000),
  },
});

const Categories = sequelize.define(
  'categories',
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },

    idCloudCategoryImg: {
      type: DataTypes.STRING(),
      defaultValue: null,
    },
  },
  {
    tableName: 'categories',
  }
);

// set an an association
AdminToken.belongsTo(Admin, {
  foreignKey: 'userID',
});
Admin.hasMany(AdminToken, {
  foreignKey: 'userID',
});

module.exports = {
  Admin,
  AdminToken,
  Categories,
};

const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const gravatar = require('gravatar');
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
    avatar: {
      type: DataTypes.STRING(),
      defaultValue: function () {
        return gravatar.url(this.email, { s: '40' }, true);
      },
    },
    idCloudAvatar: {
      type: DataTypes.STRING(),
      defaultValue: null,
    },
  },
  {
    tableName: 'users',
  }
);

const Token = sequelize.define('token', {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id', // Refers to a field  'id' in the model User
    },
  },
  refreshToken: {
    type: DataTypes.STRING(1000),
  },
});

// set an an association
Token.belongsTo(User, {
  // indicates that each record in the table Token belongs to one user from the table User
  foreignKey: 'userID',
});
User.hasMany(Token, {
  // indicates that each user can have plenty tokens.'foreignKey' is used to determine  the field,
  foreignKey: 'userID', // through which the relationship between tables occurs.
});

module.exports = {
  User,
  Token,
};

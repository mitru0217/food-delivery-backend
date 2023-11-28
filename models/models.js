const { LONG } = require('mysql/lib/protocol/constants/types');
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

const Token = sequelize.define('token', {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id', // Ссылается на поле 'id' в модели User
    },
  },
  refreshToken: {
    type: DataTypes.STRING(1000),
  },
});

// Устанавливаем ассоциацию
Token.belongsTo(User, {
  // указывает, что каждая запись в таблице Token принадлежит одному пользователю из таблицы User
  foreignKey: 'userID',
});
User.hasMany(Token, {
  // указывает, что у каждого пользователя может быть много токенов.foreignKey используется для определения поля,
  foreignKey: 'userID', // через которое происходит связь между таблицами.
});

module.exports = {
  User,
  Token,
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    userID: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    ranking: DataTypes.INTEGER,
    amountWon: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
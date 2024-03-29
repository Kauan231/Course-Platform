'use strict';

const {
  Model,
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
      /*
      User.hasMany(models.Course, {
        foreignKey: 'userId',
        as: 'Courses'
      })
      */
      User.belongsToMany(models.Course, {
        through: 'Course_Enrolls',
      })
    }
  }
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

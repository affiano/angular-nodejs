var Sequelize = require("sequelize");
var db = require("../config/db.config");

// imports
var UserModel = require("../models/user");

// define Sequelize model
const User = UserModel(db, Sequelize);

// relationship
UserRoles.belongsTo(Roles, { foreignKey: "roleId", target: "id" });
User.hasMany(UserRoles, { foreignKey: "userId", target: "id" });

// exports
module.exports.User = User;
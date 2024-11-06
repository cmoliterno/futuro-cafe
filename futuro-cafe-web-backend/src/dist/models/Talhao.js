"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Talhao = void 0;
const sequelize_1 = require("sequelize");
const DatabaseService_1 = require("../services/DatabaseService");
const sequelize = new DatabaseService_1.DatabaseService().getSequelizeInstance();
class Talhao extends sequelize_1.Model {
}
exports.Talhao = Talhao;
Talhao.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fazendaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'talhoes',
});

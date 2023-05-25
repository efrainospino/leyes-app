import pkg from 'sequelize';
const { DataTypes } = pkg;
import db from '../config/db.js';

const Clientes = db.define('clientes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
  },
  fecha_inicial: {
    type: DataTypes.STRING,
  },
  fecha_final: {
    type: DataTypes.STRING,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});


export default Clientes;
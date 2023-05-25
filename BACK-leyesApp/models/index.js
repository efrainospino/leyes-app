import Clientes from './clientes.js';
import Usuarios from './usuarios.js';

Clientes.belongsTo(Usuarios, { foreignKey: 'usuarioId', as: 'usuario'});

export {
  Clientes,
  Usuarios
}
import Sequelize from 'sequelize';

// Configuración de la conexión a la base de datos
const db = new Sequelize('appLeyes', 'root', 'contraseña', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  logging: false,
});

// Verificación de la conexión a la base de datos
db.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos MySQL');
  })
  .catch(error => {
    console.error('Error de conexión:', error);
  });

async function sincronizarModelos() {
  // { force: true }
  await db.sync().then(() => {
    console.log('Modelos sincronizados con éxito.');
  }).catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });
}

sincronizarModelos();

export default db;

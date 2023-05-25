import express from 'express';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import cors from 'cors';
import Routes from './router/router.js';

const app = express();

// Configuración del middleware
app.use(cors());


//habilitar bodyparser
app.use(json());
app.use(urlencoded({extended: true}));

// Configuración de las rutas
app.use('/', Routes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

// tareaProgramada.iniciarTareaProgramada();
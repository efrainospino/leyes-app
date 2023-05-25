import { Router } from 'express';
const router = Router();

import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, autenticarUsuario } from '../controllers/usuarioController.js';
import { getClientes, getCliente, getClientesByUsuarioId, createCliente, updateCliente, deleteCliente } from '../controllers/clienteController.js';

// usuario router 
router.post('/usuarios/auth', autenticarUsuario);
router.get('/usuarios/', getUsuarios);
router.get('/usuarios/:id', getUsuario);
router.post('/usuarios', createUsuario);
router.put('/usuarios/:id', updateUsuario);
router.delete('/usuarios/:id', deleteUsuario);

//cliente router
router.get('/clientes', getClientes);
router.get('/clientes/:id', getCliente);
router.get('/clientes/usuario/:id', getClientesByUsuarioId);
router.post('/clientes', createCliente);
router.put('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

export default router;
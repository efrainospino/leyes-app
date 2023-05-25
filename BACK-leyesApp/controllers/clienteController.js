import { check, validationResult } from 'express-validator';
import { Usuarios, Clientes } from '../models/index.js'

export async function createCliente(req, res, next) {
  // Validación de los campos del formulario
  await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req);
  await check('fecha_inicial').notEmpty().withMessage('La fecha inicial es requerida').run(req);
  await check('fecha_final').notEmpty().withMessage('La fecha final es requerida').run(req);
  await check('usuarioId').notEmpty().withMessage('El ID de usuario es requerido').run(req);

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.json({ errores: errores.array() });
  }

  const { nombre, fecha_inicial, fecha_final, usuarioId } = req.body;

  try {
    // Verificar que el usuario exista en la base de datos
    const usuarioExistente = await Usuarios.findByPk(usuarioId);

    if (!usuarioExistente) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    // Crear el cliente y asociarlo al usuario
    const nuevoCliente = await Clientes.create({
      nombre,
      fecha_inicial,
      fecha_final,
      usuarioId
    });

    res.status(201).json({ message: 'Cliente creado correctamente', cliente: nuevoCliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getClientesByUsuarioId(req, res, next) {
  const usuarioId = req.params.id;

  try {
    // Verificar que el usuario exista en la base de datos
    const usuarioExistente = await Usuarios.findByPk(usuarioId);

    if (!usuarioExistente) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    // Obtener todos los clientes asociados al usuario
    const clientes = await Clientes.findAll({
      where: { usuarioId },
      include: [{ model: Usuarios, as: 'usuario', attributes: ['nombre', 'usuario', 'correo', 'telefono'] }],
    });

    res.status(200).json({ clientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getClientes(req, res) {
  try {
    const clientes = await Clientes.findAll({
      attributes: ['nombre', 'fecha_inicial', 'fecha_final']
    });
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getCliente(req, res) {
  const idCliente = req.params.id;

  // Verificar si el ID de cliente es válido
  if (!Number.isInteger(Number(idCliente))) {
    return res.json({ msg: 'Ese cliente no existe.' });
  }

  try {
    const cliente = await Clientes.findByPk(idCliente, {
      attributes: ['nombre', 'fecha_inicial', 'fecha_final', 'usuarioId']
    });

    if (!cliente) {
      return res.json({ msg: 'Ese cliente no existe.' });
    }

    res.send(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function updateCliente(req, res, next) {
  const idCliente = req.params.id;
  const { nombre, fecha_inicial, fecha_final } = req.body;

  try {
    // Verificar que el cliente exista en la base de datos
    const clienteExistente = await Clientes.findByPk(idCliente, {
      include: {
        model: Usuarios,
        as: 'usuario',
        attributes: ['nombre', 'usuario', 'correo', 'telefono']
      }
    });

    if (!clienteExistente) {
      return res.status(400).json({ errores: [{ msg: 'Ese cliente no existe.' }] });
    }

    // Verificar si los valores han cambiado
    const valoresCambiados = {};

    if (nombre !== clienteExistente.nombre) {
      valoresCambiados.nombre = nombre;
    }
    if (fecha_inicial !== clienteExistente.fecha_inicial) {
      valoresCambiados.fecha_inicial = fecha_inicial;
    }
    if (fecha_final !== clienteExistente.fecha_final) {
      valoresCambiados.fecha_final = fecha_final;
    }

    // Si no hay cambios, retornar un mensaje
    if (Object.keys(valoresCambiados).length === 0) {
      return res.status(400).json({ errores: [{ msg: 'Los datos del cliente no han cambiado.' }] });
    }

    // Actualizar el cliente
    await Clientes.update(valoresCambiados, { where: { id: idCliente } });

    // Obtener los datos actualizados del cliente y su usuario asociado
    const updatedCliente = await Clientes.findByPk(idCliente, {
      include: {
        model: Usuarios,
        as: 'usuario',
        attributes: ['nombre', 'usuario', 'correo', 'telefono']
      }
    });

    if (!updatedCliente) {
      return res.status(400).json({ errores: [{ msg: 'No se pudo obtener el cliente actualizado.' }] });
    }

    res.send(updatedCliente);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteCliente(req, res) {
  const { id } = req.params;

  try {
    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ message: "El cliente no existe." });
    }
    await cliente.destroy();
    res.json({ message: "El cliente fue eliminado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Hubo un error al eliminar el cliente." });
  }
}
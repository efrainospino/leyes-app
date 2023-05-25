import { check, validationResult } from 'express-validator';
import { Usuarios, Clientes } from '../models/index.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export async function autenticarUsuario(req, res, next) {
  // Buscar usuario
  const usuario = await Usuarios.findOne({ where: { usuario: req.body.usuario } });

  if (!usuario) {
    res.send({ errores: [{ msg: 'Autenticación incorrecta' }] });
    return next();
  } else {
    const contraseñaValida = await bcrypt.compare(req.body.contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      res.send({ errores: [{ msg: 'Autenticación incorrecta' }] });
      return next();
    } else {
      const token = jwt.sign(
        {
          email: usuario.email,
          nombre: usuario.nombre,
          id: usuario.id,
        },
        'LLAVEDEAUTENTICACION',
        {
          expiresIn: '7h',
        }
      );
      const idUsuario = usuario.id;
      const user = usuario.usuario;
      res.send({ token, idUsuario, user });
    }
  }
};

export async function createUsuario(req, res, next) {
  // Validación
  await check('nombre').notEmpty().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres').run(req);
  await check('usuario').notEmpty().isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres').run(req);
  await check('correo').isEmail().withMessage('Ese correo no es válido').run(req);
  await check('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
  await check('confirmarContraseña').equals(req.body.contraseña).withMessage('Las contraseñas no coinciden').run(req);
  await check('telefono').notEmpty().isLength({ min: 6 }).withMessage('El teléfono debe tener al menos 6 dígitos').run(req);

  let errores = validationResult(req);

  // Validar los campos del formulario
  if (!errores.isEmpty()) {
    return res.send({
      errores: errores.array()
    });
  }

  const { nombre, correo, usuario, telefono, apellidos, rolId, sucursalId, contraseña } = req.body;

  try {
    // Verificar que el usuario no esté duplicado
    const existeUsuario = await Usuarios.findOne({ where: { usuario } });
    const existeEmail = await Usuarios.findOne({ where: { correo } });

    if (existeEmail) {
      return res.send({
        errores: { msg: 'El correo ya existe' },
      });
    }
    if (existeUsuario) {
      return res.send({
        errores: { msg: 'El usuario ya existe' },
      });
    }

    // Almacenar registro
    const hashedPassword = await bcrypt.hash(contraseña, 12);

    const newUsuario = await Usuarios.create({ nombre, correo, usuario, telefono, apellidos, rolId, sucursalId, contraseña: hashedPassword });

    res.json({ mensaje: 'Se creó el usuario correctamente' });
  } catch (error) {
    // Si hay algún error, muestra el mensaje de error y pasa al siguiente middleware
    console.log(error);
    next(error);
  }
}

export async function getUsuarios(req, res) {
  try {
    const getUsuarios = await Usuarios.findAll({
      attributes: ['nombre', 'correo', 'usuario', 'telefono']
    });
    res.json(getUsuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getUsuario(req, res, next) {
  const idUsuario = req.params.id;

  // Verificar si el ID de usuario es válido
  if (!Number.isInteger(Number(idUsuario))) {
    return res.json({ msg: 'Ese usuario no existe.' });
  }

  try {
    const usuario = await Usuarios.findByPk(idUsuario, {
      attributes: ['nombre', 'correo', 'usuario', 'telefono']
    });

    if (!usuario) {
      return res.json({ msg: 'Ese usuario no existe.' });
    }

    res.send(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function updateUsuario(req, res, next) {
  const idUsuario = req.params.id;
  const { nombre, correo, usuario, telefono } = req.body;

  try {
    // Verificar que el usuario exista en la base de datos
    const usuarioExistente = await Usuarios.findByPk(idUsuario, {
      attributes: ['id', 'nombre', 'correo', 'usuario', 'telefono'],
    });

    if (!usuarioExistente) {
      return res.json({ msg: 'Ese usuario no existe.' });
    }

    // Verificar si los valores han cambiado
    const valoresCambiados = {};

    if (nombre !== usuarioExistente.nombre) {
      valoresCambiados.nombre = nombre;
    }
    if (correo !== usuarioExistente.correo) {
      valoresCambiados.correo = correo;
    }
    if (usuario !== usuarioExistente.usuario) {
      valoresCambiados.usuario = usuario;
    }
    if (telefono !== usuarioExistente.telefono) {
      valoresCambiados.telefono = telefono;
    }

    // Si no hay cambios, retornar un mensaje
    if (Object.keys(valoresCambiados).length === 0) {
      return res.json({ msg: 'Los datos de usuario no han cambiado.' });
    }

    // Actualizar el usuario
    await Usuarios.update(valoresCambiados, { where: { id: idUsuario } });

    // Obtener los datos actualizados
    const updatedUsuario = await Usuarios.findByPk(idUsuario, {
      attributes: ['id', 'nombre', 'correo', 'usuario', 'telefono'],
    });

    if (!updatedUsuario) {
      return res.json({ msg: 'No se pudo obtener el usuario actualizado.' });
    }

    res.send(updatedUsuario);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteUsuario(req, res) {
  const { id } = req.params;

  try {
    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "El usuario no existe." });
    }
    await usuario.destroy();
    res.json({ message: "El usuario fue eliminado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Hubo un error al eliminar el usuario." });
  }
}
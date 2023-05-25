// import { createTransport } from 'nodemailer';
// import Clientes from '../models/clientes.js';

// // Configuración del transportador de nodemailer
// const transporter = createTransport({
//   // Configura aquí tu servicio de correo electrónico y las credenciales necesarias
//   service: 'Gmail',
//   auth: {
//     user: 'tucorreo@gmail.com',
//     pass: 'tupassword'
//   }
// });

// // Función para enviar el correo electrónico
// function enviarCorreo(cliente) {
//   const mailOptions = {
//     from: 'tucorreo@gmail.com',
//     to: 'destinatario@example.com',
//     subject: 'Fecha límite cerca',
//     text: `La fecha límite para el cliente ${cliente.nombre} está cerca.`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error al enviar el correo:', error);
//     } else {
//       console.log('Correo enviado:', info.response);
//     }
//   });
// }

// // Función para iniciar la tarea programada
// function iniciarTareaProgramada() {
//   schedule('* * * * *', async () => {
//     try {
//       const clientes = await Clientes.findAll();
//       const fechaActual = new Date();

//       clientes.forEach(cliente => {
//         const fechaFinal = new Date(cliente.fecha_final);
//         const tiempoRestante = fechaFinal.getTime() - fechaActual.getTime();

//         if (tiempoRestante <= 0) {
//           // La fecha límite ha pasado
//           return;
//         }

//         const tiempoRestanteHoras = Math.floor(tiempoRestante / (60 * 60 * 1000));

//         if (tiempoRestanteHoras <= 1) {
//           // Si queda una hora o menos, enviar correo electrónico
//           enviarCorreo(cliente);
//         }
//       });
//     } catch (error) {
//       console.log('Error al obtener los clientes:', error);
//     }
//   });
// }

// export default {
//   iniciarTareaProgramada
// };

const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/database');
const { use } = require('./empleados');


user.post("/signin", async (req, res, next) => {

  const { user_name, user_mail, user_password} = req.body;

  if(user_name && user_mail && user_password){

    let query = "INSERT INTO user( user_name, user_mail, user_password) ";
    query +=`VALUES ('${user_name}', '${user_mail}', '${user_password}');`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1) {

        return res.status(200).json({code: 200, message: "Usuario creado con éxito."});

    }

    return res.status(500).json({code:500, message: "Ocurrió un error."});
  }

  return res.status(500).json({code:500, message: "Campos incompletos."});

});

user.post("/login", async (req, res, next) => {

  const {user_mail, user_password} = req.body;
  const query = `SELECT * FROM user WHERE user_mail = '${user_mail}' AND user_password = '${user_password}';`;

  const rows = await db.query(query);

  if (user_mail && user_password) {

    if(rows.length == 1){

      const token = jwt.sign({

            user_id: rows[0].user_id,
            user_mail: rows[0].user_mail

      }, "debugkey");

      return res.status(200).json({code:200, message: token});

    } else {

      return res.status(200).json({code: 401, message: "Usuario y/o contraseña incorrectos."})

    }

  }

  return res.status(500).json({code:500, message: "Campos incompletos."});



});

user.get("/", async (req, res, next) => {

  const query = "SELECT * FROM user";
  const rows = await db.query(query);

  return res.status(200).json({code:200, message: rows});

});


user.get('/:name([A-Za-z]+)', async (req, res, next)=>{
  const {user_name} = req.body;
  const query = `SELECT * FROM lista WHERE nombre = '${user_name}';`;
  const rows = await db.query(query);


  console.log(user_name);


});

user.delete('/:id([0-9]{1,3})', async (req, res, next) => {
  const {user_id} = req.body;

  const query = `DELETE FROM lista WHERE id_empleado=${user_id}`;

  const rows = await db.query(query);

  if (rows.affectedRows == 1) {

    return res.status(200).json({ code: 200, message: "Empleado borrado correctamente."});

  }

  return res.status(404).json({ code: 404, message: "Empleado no encontrado."});

});


user.put("/:id([0-9]{1,3})", async (req, res, next) => {

  const {user_id, nombre, apellidos, telefono, correo, direccion} = req.body;

  if(nombre && apellidos && telefono && correo && direccion && user_id){

    const query = `UPDATE lista SET nombre=${nombre}, apellidos='${apellidos}',`;
    query += `telefono='${telefono}',correo='${correo}', direccion='${direccion}' WHERE id_empleado=${user_id};`;

    const rows = await db.query(query);

    console.log(rows);

    if (rows.affectedRows == 1) {

        return res.status(200).json({code:200, message: "Empleado actualizado correctamente."});

    };

    return res.status(500).json({code:500, message: "Ocurrió un error."});


  };

  return res.status(500).json({code:500, message: "Campos incompletos, revise de favor."});


});


module.exports = user;

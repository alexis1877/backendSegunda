//const ruta = require("express").Router();
const { Router } = require("express");
const ruta = Router();

const consulta = require("../config/conexionbd");

ruta.post("/usuario/registrarUsuario", (req, res) => {
  const { nombre, password, correo, telefono, direccion } = req.body;
  let query =
    "INSERT INTO `appcarrito`.`usuario` (`nombre`, `id_rol`, `password`, `correo`,`telefono`, `direccion`)  VALUES ('" +
    nombre +
    "', 2, '" +
    password +
    "', '" +
    correo +
    "', '" +
    telefono +
    "', '" +
    direccion +
    "');";
  consulta.query(query, (error, rows) => {
    if (!error) res.json("Usuario Creado");
    else console.log(error);
  });
});

ruta.post("/usuario/borrar", (req, res) => {
  
  const { id } = req.body;
  let query = "DELETE  FROM `appcarrito`.`usuario`  WHERE id_usuario = ?";
  consulta.query(query, [id], (error, rows) => {
    if (!error) {
      res.json("Eliminado");
    } else {
      console.log(error);
    }
  });
});

ruta.post("/usuario/recuperar", (req, res) => {
  const { correo } = req.body;
  let query =
    "SELECT password FROM `appcarrito`.`usuario` WHERE correo = '" +
    correo +
    "'";
  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

ruta.post("/usuario/getUsuario", (req, res) => {
  const { id_usuario } = req.body;
  let query =
    "SELECT id_usuario,nombre,correo,telefono,direccion,id_rol FROM `appcarrito`.`usuario` WHERE id_usuario = " +
    id_usuario +
    "";
  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

ruta.post("/login", (req, res) => {
  const { correo, password } = req.body;
  let pass = "";
  let query =
    "SELECT * FROM `appcarrito`.`usuario` WHERE correo = '" + correo + "'";
  consulta.query(query, (err, resp) => {
    if (!err) {
      pass = resp[0].password;
      if (password == pass) {
        res.json(resp[0]);
      } else {
        res.json(err);
      }
    } else {
      res.json("no se encuentra el correo");
    }
  });
});

ruta.post("/usuario/update", (req, res) => {
  const { id_usuario, nombre, correo, telefono, direccion } = req.body;
  let query =
    "UPDATE `appcarrito`.`usuario` SET `nombre` = '" +
    nombre +
    "', `correo` = '" +
    correo +
    "', `telefono` = '" +
    telefono +
    "', `direccion` = '" +
    direccion +
    "' WHERE (`id_usuario` = '" +
    id_usuario +
    "')";
  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json("Datos actualizados");
    } else {
      res.json(err);
    }
  });
});

//productos
//Mostrar todos los productos

ruta.get('/productos', (req, res) => {
  let query = "SELECT P.id, P.nombre_producto, P.precio_producto, P.cantidad, P.desc, SC.nombre AS Nombre_Sub_Categoria, C.nombre AS Cat, IM.url FROM producto_subcategoria PSC INNER JOIN productos P ON PSC.id_productos = P.id INNER JOIN sub_categoria SC ON PSC.id_sub_categoria = SC.id_sub_categoria INNER JOIN categoria C ON SC.id_categoria = C.id_categoria INNER JOIN imagen IM ON IM.id_producto = P.id";

  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json(rows);
    }
    else {
      console.log(err);
    }
  })
});

//Obtener productos por ID

ruta.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  let query = "SELECT P.id, P.nombre_producto, P.precio_producto, P.cantidad, P.desc, SC.nombre AS Nombre_Sub_Categoria, C.nombre AS Cat, IM.url FROM producto_subcategoria PSC INNER JOIN productos P ON PSC.id_productos = P.id INNER JOIN sub_categoria SC ON PSC.id_sub_categoria = SC.id_sub_categoria INNER JOIN categoria C ON SC.id_categoria = C.id_categoria INNER JOIN imagen IM ON IM.id_producto = P.id WHERE id = ?";
  consulta.query(query, [id], (error, rows) => {
    if (Object.keys(rows).length !== 0) {
      return res.json(rows[0]);
    } else {
      res.status(400).json({ text: 'no existe el producto' })
    }
  })
});

//Crando productos

ruta.post('/productos/crear', (req, res) => {

  const {nombre_producto, precio_producto, cantidad, desc, id_sub_categoria, url } = req.body;
  
  const query = `
      call insertarDatos(?, ?, ?, ?, ?, ?);
  `;
  consulta.query(query, [nombre_producto, precio_producto, cantidad, desc, id_sub_categoria, url], (error, rows, fields) => {
    if (!error){
      res.json({Status: 'Producto Creado'});
    }
    else{
      console.log(error);
    }
  })
});

//Actualizar productos

ruta.put('/productos/actualizar/:id', (req, res) => {
  const {nombre_producto, precio_producto, cantidad, desc, id_sub_categoria, url } = req.body;
  const {id} = req.params;
  const query = `
      call modificarDatos(?, ?, ?, ?, ?, ?, ?);
  `;

  consulta.query(query, [id, nombre_producto, precio_producto, cantidad, desc, id_sub_categoria, url], (error, rows, fields) => {
    if (!error){
      res.json("producto actualizado");
    }
    else{
      console.log(error);
    }
  })
})


//Borrar productos

ruta.delete('/productos/eliminar/:id', (req, res) => {
  const { id } = req.params;
  let query = "call eliminarDatos(?);";
  consulta.query(query, [id], (error, rows) => {
    if (!error) {
      res.json('Producto eliminado');
    }
    else {
      console.log(error);
    }
  })
});


//Categorias
ruta.get("/categorias", (req, res) => {
  let query = "SELECT id_categoria, nombre FROM categoria";

  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//Sub-categorias
ruta.get("/subcategorias", (req, res) => {
  let query =
    "SELECT SC.id_categoria, SC.nombre FROM sub_categoria SC INNER JOIN categoria C ON SC.id_categoria = C.id_categoria";

  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});


// Termina productos

//  CONSULTAR TICKET
//http://localhost:4200/ticket/consulta/1
ruta.get('/ticket/consulta/:id', (req, res) => {
  const { id } = req.params;
  //let sql = "SELECT venta.id_venta, venta.id_ticket, venta.cantidad, nombre_producto, categoria_producto, precio_producto, descripbr_producto, imagen FROM venta INNER JOIN productos ON venta.id_producto = productos.id -- tabla.FK = tabla.PK INNER JOIN ticket ON venta.id_ticket = ticket.id_ticket;";
  let sql = "SELECT venta.id_venta, usuario.nombre, venta.id_ticket, venta.cantidad, nombre_producto, precio_producto, productos.desc FROM venta INNER JOIN productos ON venta.id_producto = productos.id INNER JOIN ticket ON venta.id_ticket = ticket.id_ticket INNER JOIN usuario ON ticket.id_usuario =usuario.id_usuario WHERE ticket.id_ticket = ?";
  consulta.query(sql, [id], (err, rows) => {
      if (!err) {
          res.json(rows);
      } else {
          console.log(err);
      }

  })
});

//ELIMINAR
//DELETE FROM `appcarrito`.`venta` WHERE id_venta = 9;
//elimina venta, no ticket
ruta.delete('/ticket/eliminar/:id', (req, res) => {
  const { id } = req.params;
  let sql = "DELETE FROM `appcarrito`.`venta` WHERE id_venta = ?";
  consulta.query(sql, [id], (error, rows) => {
      if (!error) {
          res.json(rows);
      } else {
          console.log(error);
      }
  })
});

// -------------------------------

//INSERTAR PRODUCTO EN TICKET
//  NOTA: colocar mismas variables que en postman
//http://localhost:4200/ticket/insertar
ruta.post('/ticket/insertar', (req, res) => {
  const { id_ticket, id_producto, cantidad } = req.body;
  console.log(req.body);
  let sql = "call insertar_en_ticket('" + id_ticket + "', '" + id_producto + "', '" + cantidad + "')";
  consulta.query(sql, (err, rows) => {
      if (!err) {
          res.json(rows);
      } else {
          console.log(err);
      }

  })
});

//MODIFICAR CANTIDAD
ruta.post('/ticket/modificacant', (req, res) => {
  const { id_venta, cantidad } = req.body;
  let sql = "call modificar_cant('" + id_venta + "', '" + cantidad + "')";
  consulta.query(sql, (err, rows) => {
      if (!err) {
          res.json(rows);
      } else {
          console.log(err);
      }

  })
});

ruta.post('/generaticket', (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  let sql = "INSERT INTO `appcarrito`.`ticket` (`id_usuario`) VALUES ('" + id + "')";
  consulta.query(sql, (err, rows) => {
      if (!err) {
          res.json(rows.insertId);
      } else {
          console.log(err);
      }

  })
});

module.exports = ruta;

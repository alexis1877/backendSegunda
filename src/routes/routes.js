// desde express requiero su metodo llamdo router
const { Router } = require('express');
const router = Router();

//Entamos al archivo database y trae la cadena de conexion
//IMPORTANTE
const mysqlConnection = require('../database');

router.get('/', (req, res) => {
    res.json({ "Title": "Hello World" });
});

//Aqui se importa el modulo de database
//creamos la ruta inicial para obtener los datos
//usuario
router.get('/h', (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/eoo', (req, res) => {
    console.log(req, body);
    res.send('recibido');
});


//REGISTRO
//   DE
//USUARIOS
router.post('/usuario/registrar', (req, res) => {
    const { nombre, id_rol, password, correo } = req.body;
    let sql = "INSERT INTO `appcarrito`.`usuario` ( `nombre`, `id_rol`, `password`, `correo`) VALUES('" + nombre + "', '" + id_rol + "', '" + password + "', '" + correo + "')";
    mysqlConnection.query(sql, (err, rows) => {
        if (!err) {
            res.json('registro incertado');
        } else {
            console.log(err);
        }

    })
});



//RECUPERAR
//CONTRASEÑA
router.post('/usuario/recuperar', (req, res) => {
    const { correo } = req.body;
    let sql = "SELECT password FROM `appcarrito`.`usuario` WHERE correo = '" + correo + "'";
    mysqlConnection.query(sql, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});


//Eliminar datos
router.delete('/usuario/eliminar/:id', (req, res) => {
    const { id } = req.params;
    let sql = "DELETE FROM `appcarrito`.`usuario` WHERE id_usuario = ?";
    mysqlConnection.query(sql, [id], (error, rows) => {
        if (!error) {
            res.json('Eliminado');
        } else {
            console.log(error);
        }
    })
});



// ------------------------------------------LISTO
//CARRITO APP
//Productos 
router.get('/muestra/productos/:id', (req, res) => {
    const { id } = req.params;
    let sql = "SELECT nombre_producto, precio_producto, productos.desc  FROM productos LEFT join venta on venta.id_producto = productos.id WHERE productos.id >= ?";
    mysqlConnection.query(sql, [id], (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
});


//  CONSULTAR TICKET
//http://localhost:4200/ticket/consulta/1
router.get('/ticket/consulta/:id', (req, res) => {
    const { id } = req.params;
    //let sql = "SELECT venta.id_venta, venta.id_ticket, venta.cantidad, nombre_producto, categoria_producto, precio_producto, descripbr_producto, imagen FROM venta INNER JOIN productos ON venta.id_producto = productos.id -- tabla.FK = tabla.PK INNER JOIN ticket ON venta.id_ticket = ticket.id_ticket;";
    let sql = "SELECT venta.id_venta, usuario.nombre, venta.id_ticket, venta.cantidad, nombre_producto, precio_producto, productos.desc, imagen FROM venta INNER JOIN productos ON venta.id_producto = productos.id INNER JOIN ticket ON venta.id_ticket = ticket.id_ticket INNER JOIN usuario ON ticket.id_usuario =usuario.id_usuario WHERE ticket.id_ticket = ?";
    mysqlConnection.query(sql, [id], (err, rows) => {
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
router.delete('/ticket/eliminar/:id', (req, res) => {
    const { id } = req.params;
    let sql = "DELETE FROM `appcarrito`.`venta` WHERE id_venta = ?";
    mysqlConnection.query(sql, [id], (error, rows) => {
        if (!error) {
            res.json(row);
        } else {
            console.log(error);
        }
    })
});

// -------------------------------

//INSERTAR PRODUCTO EN TICKET
//  NOTA: colocar mismas variables que en postman
//http://localhost:4200/ticket/insertar
router.post('/ticket/insertar', (req, res) => {
    const { id_ticket, id_producto, cantidad } = req.body;
    let sql = "call insertar_en_ticket('" + id_ticket + "', '" + id_producto + "', '" + cantidad + "')";
    mysqlConnection.query(sql, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
});


//Genera ticket
//INSERT INTO `appcarrito`.`ticket` (`id_ticket`) VALUES ('6');
router.post('/generaticket/:id', (req, res) => {
    const { id } = req.param;
    let sql = "INSERT INTO `appcarrito`.`ticket` (`id_usuario`) VALUES ('" + id + "')";
    mysqlConnection.query(sql, [id], (err, rows) => {
        if (!err) {
            res.json(rows.insert.id);
        } else {
            console.log(err);
        }

    })
});



//    Ahora Obtiene id producto
//SELECT productos.id FROM productos WHERE nombre_producto = 'tv';
router.post('/obtenid', (req, res) => {
    const { nombre_producto } = req.body;
    let sql = "SELECT productos.id FROM productos WHERE nombre_producto = '" + nombre_producto + "'";
    mysqlConnection.query(sql, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
});


//MODIFICAR CANTIDAD
router.post('/ticket/modificacant', (req, res) => {
    const { id_venta, cantidad } = req.body;
    let sql = "call modificar_cant('" + id_venta + "', '" + cantidad + "')";
    mysqlConnection.query(sql, (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
});


//TOTAL
router.get('/ticket/total/:id', (req, res) => {
    const { id } = req.params;
    //let sql = "SELECT venta.id_venta, venta.id_ticket, venta.cantidad, nombre_producto, categoria_producto, precio_producto, descripbr_producto, imagen FROM venta INNER JOIN productos ON venta.id_producto = productos.id -- tabla.FK = tabla.PK INNER JOIN ticket ON venta.id_ticket = ticket.id_ticket;";
    let sql = "SELECT  sum(venta.cantidad) as total FROM venta INNER JOIN productos ON venta.id_producto = productos.id INNER JOIN ticket  ON venta.id_ticket = ticket.id_ticket INNER JOIN usuario ON ticket.id_usuario =usuario.id_usuario WHERE ticket.id_ticket = ?";
    mysqlConnection.query(sql, [id], (err, rows) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }

    })
});


module.exports = router;
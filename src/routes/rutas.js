const consulta = require("../config/conexionBD");
const rutas = require("express").Router();

//Mostrar todos los productos

rutas.get("/productos", (req, res) => {
  let query =
    "SELECT P.id, P.nombre_producto, P.precio_producto, P.cantidad, P.desc, SC.nombre AS Nombre_Sub_Categoria, C.nombre AS Cat, IM.url FROM producto_subcategoria PSC INNER JOIN productos P ON PSC.id_productos = P.id INNER JOIN sub_categoria SC ON PSC.id_sub_categoria = SC.id_sub_categoria INNER JOIN categoria C ON SC.id_categoria = C.id_categoria INNER JOIN imagen IM ON IM.id_producto = P.id";

  consulta.query(query, (err, rows) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//Obtener productos por ID

rutas.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  let query =
    "SELECT P.id, P.nombre_producto, P.precio_producto, P.cantidad, P.desc, SC.nombre AS Nombre_Sub_Categoria, C.nombre AS Cat, IM.url FROM producto_subcategoria PSC INNER JOIN productos P ON PSC.id_productos = P.id INNER JOIN sub_categoria SC ON PSC.id_sub_categoria = SC.id_sub_categoria INNER JOIN categoria C ON SC.id_categoria = C.id_categoria INNER JOIN imagen IM ON IM.id_producto = P.id WHERE id = ?";
  consulta.query(query, [id], (error, rows) => {
    if (Object.keys(rows).length !== 0) {
      return res.json(rows);
    } else {
      res.status(400).json({ text: "no existe el producto" });
    }
  });
});

//Crando productos

rutas.post("/productos/crear", (req, res) => {
  const {
    nombre_producto,
    precio_producto,
    cantidad,
    desc,
    id_sub_categoria,
    url,
  } = req.body;

  const query = `
        call insertarDatos(?, ?, ?, ?, ?, ?);
    `;
  consulta.query(
    query,
    [nombre_producto, precio_producto, cantidad, desc, id_sub_categoria, url],
    (error, rows, fields) => {
      if (!error) {
        res.json({ Status: "Producto Creado" });
      } else {
        console.log(error);
      }
    }
  );
});

//Actualizar productos

rutas.put("/productos/actualizar/:id", (req, res) => {
  const {
    nombre_producto,
    precio_producto,
    cantidad,
    desc,
    id_sub_categoria,
    url
  } = req.body;
  const { id } = req.params;
  const query = `
        call modificarDatos(?, ?, ?, ?, ?, ?, ?);
    `;

  consulta.query(
    query,
    [
      id,
      nombre_producto,
      precio_producto,
      cantidad,
      desc,
      id_sub_categoria,
      url,
    ],
    (error, rows, fields) => {
      if (!error) {
        res.json("producto actualizado");
      } else {
        console.log(error);
      }
    }
  );
});

//Borrar productos

rutas.delete("/productos/eliminar/:id", (req, res) => {
  const { id } = req.params;
  let query = "call eliminarDatos(?);";
  consulta.query(query, [id], (error, rows) => {
    if (!error) {
      res.json("Producto eliminado");
    } else {
      console.log(error);
    }
  });
});

//Categorias
rutas.get("/categorias", (req, res) => {
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
rutas.get("/subcategorias", (req, res) => {
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

module.exports = rutas;

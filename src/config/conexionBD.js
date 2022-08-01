const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "appcarrito"
});

conexion.connect((err) => {
    if(err){
        console.log('Ha ocurrido un ' + err);
    }else{
        console.log('La base de datos conectada!');
    }
});

module.exports = conexion;

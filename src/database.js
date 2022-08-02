const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'appcarrito'
});

mysqlConnection.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Bd conectada');
    }
});

//Aqui tenemos el modulo y tenemos que exportarlo para utilizarlo
module.exports = mysqlConnection;
//  requiero del modulo express y lo guardo en una constante
const express = require('express');
const cors = require('cors');

//  funcion que retorna objeto almacenado en la constante app
const app = express();

//SETTING --seccion para configuracion
//  Confiuracion parte de la constante app
//              si un sistema operativo nos da un puerto y lo toma si no es el 4200
app.set('port', process.env.PORT || 4000);
app.use(cors());

//MIDDLEWARES
//  permite recibir formato json y entenderlo
app.use(express.json());
//  enviar datos de un formulario ocupamos esta
app.use(express.urlencoded({ extended: false }));


//ROUTES  --creamos las rutas urls
app.use(require('./routes/routes'));

//Agregar esta
//ap.use();



//  inicicilaizarlo y colocar el puerto pa' que este escuchando
app.listen(app.get('port'), () => {
    console.log('Server en el puerto', app.get('port'));
});
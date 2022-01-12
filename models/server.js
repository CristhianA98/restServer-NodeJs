const express = require('express');
const cors = require('cors');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        
        //Middlewares
        this.middlewares();

        //Rutas App
        this.routes();
    }

    middlewares(){
        /* cors */
        this.app.use(cors());

        /* Lectura y parseo del body */
        this.app.use( express.json() );

        /* Directorio Público */
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath,require('../routes/usuario'));
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Puerto: ', this.port);
        });
    }
}

module.exports = Server;
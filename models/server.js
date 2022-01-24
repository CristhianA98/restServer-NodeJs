const express = require('express');
const cors = require('cors');
const fileUpload= require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths ={
            auth:'/api/auth',
            usuarios:'/api/usuarios',
            categorias:'/api/categorias',
            productos:'/api/productos',
            buscar:'/api/buscar',
            uploads:'/api/uploads'
        }
        
        //Middlewares
        this.middlewares();

        //Rutas App
        this.routes();

        //Conectar BD
        this.conectarDB();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        /* cors */
        this.app.use(cors());

        /* Lectura y parseo del body */
        this.app.use( express.json() );

        /* Directorio Público */
        this.app.use(express.static('public'));

        /* FILE UPLOAD*/
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.usuarios,require('../routes/usuario'));
        this.app.use(this.paths.categorias,require('../routes/categoria'));
        this.app.use(this.paths.productos,require('../routes/producto'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.uploads,require('../routes/upload'));
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Puerto: ', this.port);
        });
    }
}

module.exports = Server;
const { Router } = require('express');
const { check } = require('express-validator');
const { ingresarProducto,obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto }= require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = new Router();

/* RUTAS CREADAS - CRUD */

//GET todas las categorias - público
router.get('/', obtenerProductos);

router.get('/:id', obtenerProducto);

router.post('/',[
    validarJWT,
    check('nombre',"Nombre es obligatorio").notEmpty(),
    check('categoria').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],ingresarProducto);

router.put('/:id', [
    validarJWT,

],actualizarProducto);

router.delete('/:id',[
    
],eliminarProducto)



module.exports = router;

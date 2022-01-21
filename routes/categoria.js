const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria,obtenerCategorias,obtenerCategoria,actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


const router = new Router();

/* RUTAS CREADAS - CRUD */

//GET todas las categorias - público
router.get('/', obtenerCategorias);

//GET todas las categorias por id - público
router.get('/:id',[
    check('id','Id no válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

//Crear categoria - privado - cuaalquier persona
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquier persona
router.put('/:id',[
    validarJWT,
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar categoria - SOLO ADMIN
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','Id no válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
], borrarCategoria);

module.exports = router;

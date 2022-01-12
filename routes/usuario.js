const { Router } = require('express');
const { usuarioGet, usuarioPut, usuarioPost, usuarioDelete } = require('../controllers/usuarios');

const router = new Router();

/* RUTAS CREADAS - CRUD */

router.get('/', usuarioGet);
router.put('/:id', usuarioPut);
router.post('/', usuarioPost);
router.delete('/', usuarioDelete);


module.exports = router;

const { Router } = require('express');
const {check} = require('express-validator');

const { usuarioGet, usuarioPut, usuarioPost, usuarioDelete } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRolValido, esEmailExistente, existeusuarioPorID } = require('../helpers/db-validator');

const router = new Router();

/* RUTAS CREADAS - CRUD */

router.get('/', usuarioGet);

router.put('/:id',[
    check('id','no es un ID válido').isMongoId(),
    check('id').custom(existeusuarioPorID),
    check('rol').custom( esRolValido ),
    validarCampos
], usuarioPut);

router.post('/', [ 
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe contener más de 6 letras').isLength({min:6}),
    check('correo','El correo no es válido').isEmail(),
    //check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRolValido ),
    check('correo').custom( esEmailExistente ),
    validarCampos
],usuarioPost);

router.delete('/:id',[
    check('id','no es un ID válido').isMongoId(),
    check('id').custom(existeusuarioPorID),
    validarCampos
] ,usuarioDelete);


module.exports = router;

const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuarioGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
/*     
    const usuarios = await Usuario.find({ estado:true })
                                .skip(Number( desde ))
                                .limit(Number( limite ));
    
    const total = await Usuario.countDocuments({ estado:true }); */

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado:true }),     

        Usuario.find({ estado:true })
                                .skip(Number( desde ))
                                .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    })
};

const usuarioPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    /* Encriptar password */
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    /* Guardar información */
    await usuario.save();

    res.json({
        msg: 'Post',
        usuario
    });
}

const usuarioPut = async(req, res) => {

    const { id } = req.params;
    const { _id,password, google, correo, ...resto } = req.body;

    /* VALIDAR CONTRA BASE DE DATOS */
    if (password) {
        /* Encriptar password */
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json({
        id
    });
}

const usuarioDelete = async(req, res) => {
    const {id} = req.params;

    //Borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
        usuario
    });
}

module.exports = {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete
}
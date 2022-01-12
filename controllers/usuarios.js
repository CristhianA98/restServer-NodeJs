const { response } = require('express');

const usuarioGet = (req, res = response) => {

    const params = req.query;

    res.json({
        msg: 'Get API - Controlador',
        params
    })
};

const usuarioPost = (req, res) => {

    const { nombre,edad } = req.body;

    res.json({
        msg: 'Post',
        nombre,
        edad
    });
}

const usuarioPut = (req, res) => {

    const id = req.params.id;

    res.json({
        msg: 'Put',
        id
    });
}

const usuarioDelete = (req, res) => {
    res.json({
        msg: 'Deltete'
    });
}

module.exports = {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete
}
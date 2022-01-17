const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no se encuentra registrado en la BD`);
    }
}

/* Verificar si existe el corre */
const esEmailExistente = async (correo = '') => {

    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error ('Ese correo ya se encuentra registrado');
    }
}

const existeusuarioPorID = async (id) => {

    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error (`Id "${id}" no encontrado`);
    }
}

module.exports = {
    esRolValido,
    esEmailExistente,
    existeusuarioPorID
}
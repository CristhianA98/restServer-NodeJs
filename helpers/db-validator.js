const { Categoria, Producto } = require('../models');
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

const existeCategoriaPorId = async(id)=>{
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error (`Categoria "${existeCategoria}" no encontrada`);
    }
}

const existeProductoPorId = async(id)=>{
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error (`Producto "${existeProducto}" no encontrada`);
    }
}

/* VALIDAR COLECCIONES PERMITIDAS */
const coleccionesPermitidas = (coleccion = '',colecciones =[])=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La colecciones ${coleccion} no es permitida: Permitidos -> ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido,
    esEmailExistente,
    existeusuarioPorID,
    //Categoria
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}
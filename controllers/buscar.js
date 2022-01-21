const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarusuario = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino); //tre or false
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino); //tre or false
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino); //tre or false
    if (esMongoID) {
        const categoria = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria','nombre');

    res.json({
        results: productos
    })
}


const buscar = (req, res) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Colecciones permitidas: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarusuario(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino,res);
            break;
        default:
            res.status(500).json({
                msg: "Busqueda Olvidada"
            })
    }


}

module.exports = {
    buscar
}
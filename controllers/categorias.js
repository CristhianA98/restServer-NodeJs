const { Categoria } = require("../models");

/* LISTAR CATEGORIAS - PAGINADO */
const obtenerCategorias = async (req, res) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),

        Categoria.find({ estado: true })
            .populate("usuario", "nombre")
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categorias
    });
}

/* OBTENER UNA CATEGORIA POR MEDIO DEL ID */
const obtenerCategoria = async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate("usuario", "nombre");

    if (!categoria.estado) {
        return res.status(400).json({
            msg: "Categoria Eliminada"
        })
    }

    res.json({
        categoria
    });
}

/* CREAR CATEGORIA */
const crearCategoria = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //Generar data al guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //GUARDAR DB
    await categoria.save();

    res.status(201).json(categoria)
}

/* ACTUALIZAR CATEGORIA */

const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.status(200).json({
        categoria
    })
}

/* ELIMINAR CATEGORIA */
const borrarCategoria = async(req,res)=>{
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});

    res.status(200).json({
        categoriaBorrada
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
const { Producto } = require("../models");

const obtenerProductos = async(req,res)=>{
    const { limite = 5, desde = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),

        Producto.find({ estado: true })
            .populate("usuario", "nombre")
            .populate("categoria","nombre")
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        productos
    });
}

const obtenerProducto = async(req,res)=>{
    const { id } = req.params;
    const producto = await Producto.findById(id).populate("usuario", "nombre").populate("categoria","nombre");

    if (!producto.estado) {
        return res.status(400).json({
            msg: "Categoria Eliminada"
        })
    }

    res.json({
        producto
    });
}


const ingresarProducto = async(req,res)=>{
    const { nombre,precio,categoria,descripcion,disponible } = req.body;
    
    const data ={
        nombre:nombre.toUpperCase(),
        precio,
        categoria,
        descripcion,
        disponible,
        usuario:req.usuario._id
    }

    const producto = new Producto(data);
    
    await producto.save({new:true});
    
    res.status(400).json(producto);
}

const actualizarProducto = async(req,res)=>{
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});

    res.status(200).json({
        producto
    })
}

const eliminarProducto = async(req,res)=>{
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false},{new:true});

    res.status(200).json({
        productoBorrado
    });
}


module.exports = {
    ingresarProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}
const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const cargarArchivo = async (req, res = response) => {

    try {
        /* SUBIR IMAGENES - PREDETERMINADO
        const nombre = await subirArchivo(req.files); */

        /* SUBIR CUALQUIER COSA EJ .txt .md 
        const nombre = await subirArchivo(req.files, ['txt', 'md'], 'texto');*/

        /* IMAGENES */
        const nombre = await subirArchivo(req.files, undefined, 'img');


        res.json({
            nombre
        })

    } catch (error) {
        res.status(400).json({
            error
        })
    }

}

const actualizarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id : ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id : ${id}`
                })
            }
            break;
        default:
            res.status(500).json({ msg: 'Olvidado validar esta coleccion' });
    }

    // Limpiar imagen anterior del servidor
    if (modelo.img) {
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    });
}

const actualizarImagenCloudinary = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id : ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id : ${id}`
                })
            }
            break;
        default:
            res.status(500).json({ msg: 'Olvidado validar esta coleccion' });
    }

    if (modelo.img) {
        //Eliminar imagen del servidor cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.');
        
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    });
}

const mostrarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id : ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id : ${id}`
                })
            }
            break;
        default:
            res.status(500).json({ msg: 'Olvidado validar esta coleccion' });
    }

    // Limpiar imagen anterior del servidor
    if (modelo.img) {
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathNoFound = path.join(__dirname,'../assets/no-image.jpg');

    res.sendFile(pathNoFound)

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
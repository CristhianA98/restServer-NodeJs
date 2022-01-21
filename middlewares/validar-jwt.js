const { json } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req,res,next)=>{
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:"No hay token"
        });
    }

    try {
        const {uid} =  jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //Encontrar Usuario
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido, usuario no existe en db'
            });
        }
        
        //Verificar que se encuentre en estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido, usuario eliminado'
            });
        }
        
        req.usuario= usuario;
        req.uid = uid;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:"Token no válido"
        });
    }
}

module.exports={
    validarJWT
}
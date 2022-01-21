const { response } = require('express');

const esAdminRole = (req,res,next)=>{
    if(!req.usuario){
        return res.status(500).json({
            msg:"Se quiere verificar el role sin validar el token primero"
        })
    }

    const {rol, nombre} = req.usuario;

    if(rol!=='ADMIN_ROLE'){
        return res.status(401).json({
            msg:`${nombre} -> no es un usuario administrador`
        })
    }

    next();
}

const tieneRol = (...roles) =>{
    return (req,res,next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg:"Se quiere verificar el role sin validar el token primero"
            })
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El servicio require solo controles como: ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}
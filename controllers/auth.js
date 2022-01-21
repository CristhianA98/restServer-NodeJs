const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const {googleVerify} = require('../helpers/google-verify');

const login = async (req, res) => {

    const { correo, password } = req.body;

    try {
        //verificar si existe el email
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no válido'
            });
        }

        // verficar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario/Password no válido: estado false'
            });
        }

        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Password no válido'
            });
        }

        // generar JWT
        const token = await generarJWT(usuario.id);


        res.status(500).json({
           usuario,
           token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador"
        });
    }

}

const googleSingIn = async(req,res)=>{
    const {id_token} = req.body;
    
    try {
        const {correo,nombre,img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //crearlo
            const data ={
                nombre,
                correo,
                password:':D',
                img,
                google:true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB esta en estado false BD
        if(!usuario.estado){
            return res.status(401).josn({
                msg:"Hable con el administrador, usuario bloqueado"
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            msg:"Token de google no válido"
        });
    }

}

module.exports = { 
    login,
    googleSingIn
 }
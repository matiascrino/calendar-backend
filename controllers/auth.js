const {response} = require("express");
const Usuario = require("../models/user-model");
const bcrypt = require("bcryptjs");
const {generarJWT} = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const {email, pass} = req.body;

    try{

        let usuario = await Usuario.findOne({email});
        
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: "El usuario ya existe con ese email",
            });      
        }  
        
        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.pass = bcrypt.hashSync(pass, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs",
        });
    }

};


const loginUsuario = async (req, res = response) => {

    const { email, pass } = req.body;

    try{

        const usuario = await Usuario.findOne({email});
        
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe con ese email",
            });      
        }
        
        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(pass, usuario.pass);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "Password incorrecto",
            });      
        }

        const token = await generarJWT(usuario.id, usuario.name);
        
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    }catch(error){
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs",
        });      
    }
};


 const revalidarToken = async (req, res = response) => {
    const {uid, name} = req;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid, name,
        token
    });
 };





module.exports = { crearUsuario, loginUsuario, revalidarToken };
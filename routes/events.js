const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const {validarJWT} = require("../middlewares/validar_jwt");
const {getEventos, crearEvento, actualizarEvento, eliminarEvento} = require("../controllers/events");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

// todas deben pasasr por la validacion del jwt
router.use(validarJWT);


//obtener eventos
router.get("/",getEventos);

//crear un nuevo evento
router.post("/",[
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos
], crearEvento);

//actualizar evento
router.put(
	"/:id",
	[
		check("title", "El titulo es obligatorio").not().isEmpty(),
		check("start", "Fecha de inicio es obligatoria").custom(isDate),
		check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
		validarCampos,
	],
	actualizarEvento
);

//borrar evento
router.delete("/:id", eliminarEvento);


module.exports = router;
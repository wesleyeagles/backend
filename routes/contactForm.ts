import express from "express";
import contactFormController from "../controllers/contactFormController";

const router = express.Router();

router.post("/enviar-formulario", contactFormController.sendContactForm);

export default router;

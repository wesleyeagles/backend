import express from "express";
import contactFormController, { deletaContato, getAllContatos } from "../controllers/contactFormController";

const router = express.Router();

router.post("/enviar-formulario", contactFormController.sendContactForm);

router.delete("/deletar/:id", deletaContato);

router.get("/contatos", getAllContatos);

export default router;

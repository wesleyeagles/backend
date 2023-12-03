import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById } from "../controllers/UserController";
import upload from "../middleware/uploadMiddleware";

const userRouter = Router();

userRouter.get("/usuario-por-id/:id", getUserById);
userRouter.post("/criar-usuario", upload.single("image"), createUser); // Rota para criar usuário
userRouter.get("/todos-usuarios", getAllUsers); // Rota para obter todos os usuários
userRouter.delete("/deletar/:id", deleteUser); // Rota para obter todos os usuários

export { userRouter };

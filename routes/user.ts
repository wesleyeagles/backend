import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userRouter = Router();

userRouter.get("/usuario-por-id/:id", UserController.getUserById);

export { userRouter };

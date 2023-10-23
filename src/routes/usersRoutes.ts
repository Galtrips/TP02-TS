import express from "express";
import usersRoutesController from "./controller/usersRoutesController";

const usersRoutes = express.Router();

usersRoutes.post("/register", usersRoutesController.register);
usersRoutes.post("/login", usersRoutesController.login);

export default usersRoutes;
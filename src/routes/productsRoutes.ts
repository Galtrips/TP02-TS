import express from "express";
import productsRoutesController from "./controller/productsRoutesController";
import checkAuth from "../middlewares/checkAuth";


const productsRoutes = express.Router();

productsRoutes.get("/", checkAuth, productsRoutesController.getAllProducts);
productsRoutes.post("/", checkAuth, productsRoutesController.createProduct);
productsRoutes.get("/:id", checkAuth, productsRoutesController.getProduct);
productsRoutes.put("/:id", checkAuth, productsRoutesController.updateProduct);
productsRoutes.delete("/:id", checkAuth, productsRoutesController.deleteProduct);
productsRoutes.post("/buy/:id", checkAuth, productsRoutesController.buyProduct);

export default productsRoutes;
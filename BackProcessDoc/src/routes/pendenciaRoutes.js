import express from "express";
import { 
  cadastrarPendencia, 
  listarPendencias, 
  deletarPendencia 
} from "../controllers/pendenciaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const pendenciaRouter = express.Router();

pendenciaRouter.post("/", authMiddleware, cadastrarPendencia);
pendenciaRouter.get("/", authMiddleware, listarPendencias);
pendenciaRouter.delete("/:id", authMiddleware, deletarPendencia);

export default pendenciaRouter;
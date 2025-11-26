import express from "express";
import { 
  cadastrarCliente, 
  listarClientes, 
  obterCliente, 
  deletarCliente 
} from "../controllers/clienteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const clienteRouter = express.Router();

clienteRouter.post("/", authMiddleware, cadastrarCliente);
clienteRouter.get("/", authMiddleware, listarClientes);
clienteRouter.get("/:id", authMiddleware, obterCliente);
clienteRouter.delete("/:id", authMiddleware, deletarCliente);

export default clienteRouter;

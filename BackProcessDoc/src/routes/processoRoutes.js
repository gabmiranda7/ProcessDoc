import express from "express";
import { 
  cadastrarProcesso, 
  listarProcessos, 
  deletarProcesso 
} from "../controllers/processoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const processoRouter = express.Router();

processoRouter.post("/", authMiddleware, cadastrarProcesso);
processoRouter.get("/", authMiddleware, listarProcessos);
processoRouter.delete("/:id", authMiddleware, deletarProcesso);

export default processoRouter;

import express from "express";
import { 
  cadastrarDocumento, 
  listarDocumentos, 
  deletarDocumento 
} from "../controllers/documentoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const documentoRouter = express.Router();

documentoRouter.post("/", authMiddleware, cadastrarDocumento);
documentoRouter.get("/", authMiddleware, listarDocumentos);
documentoRouter.delete("/:id", authMiddleware, deletarDocumento);

export default documentoRouter;
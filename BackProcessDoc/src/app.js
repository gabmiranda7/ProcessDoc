import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import processoRoutes from "./routes/processoRoutes.js";
import documentoRoutes from "./routes/documentoRoutes.js";
import pendenciaRoutes from "./routes/pendenciaRoutes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/processos", processoRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/pendencias", pendenciaRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "API ProcessDoc rodando 🚀",
    version: "1.0.0",
    database: "SQL Server"
  });
});

app.get("/api", (req, res) => {
  res.json({ 
    message: "API ProcessDoc",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      clientes: "/api/clientes",
      processos: "/api/processos",
      documentos: "/api/documentos",
      pendencias: "/api/pendencias"
    }
  });
});

export default app;

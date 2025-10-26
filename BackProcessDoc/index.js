import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API ProcessDoc rodando 🚀");
});

app.get("/api", (req, res) => {
  res.json({ 
    message: "API ProcessDoc",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users"
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 CORS habilitado`);
  console.log(`🔗 Rotas disponíveis:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/users/register`);
  console.log(`   - GET /api/users/me`);
});
import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDB();
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 CORS habilitado`);
      console.log(`💾 Banco: SQLite`);
    });
  } catch (err) {
    console.error("❌ Erro ao iniciar servidor:", err);
    process.exit(1);
  }
}

startServer();
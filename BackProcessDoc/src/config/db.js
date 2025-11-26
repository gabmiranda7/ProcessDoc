import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'processdoc.db');

let db = null;

async function connectDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar ao SQLite:', err);
        reject(err);
      } else {
        console.log('✅ Conectado ao SQLite com sucesso!');
        
        // Habilitar foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) console.error('Erro ao habilitar foreign keys:', err);
          resolve(db);
        });
      }
    });
  });
}

async function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database not connected'));
    }

    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Erro na query SELECT:', err);
          reject(err);
        } else {
          resolve({ recordset: rows || [] });
        }
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) {
          console.error('Erro na query INSERT/UPDATE/DELETE:', err);
          reject(err);
        } else {
          resolve({ 
            recordset: [{ id: this.lastID }],
            changes: this.changes
          });
        }
      });
    }
  });
}

async function closeDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('❌ Erro ao fechar conexão:', err);
          reject(err);
        } else {
          console.log('✅ Conexão fechada');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

async function initDB() {
  try {
    await connectDB();

    // Criar tabelas
    const tables = `
      CREATE TABLE IF NOT EXISTS [User] (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT DEFAULT 'ADVOGADO',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS [Cliente] (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomeCompleto TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        telefone TEXT,
        email TEXT,
        endereco TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS [Processo] (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT UNIQUE NOT NULL,
        tribunal TEXT NOT NULL,
        vara TEXT,
        natureza TEXT NOT NULL,
        clienteId INTEGER,
        status TEXT DEFAULT 'ABERTO',
        prazo DATETIME,
        observacoes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clienteId) REFERENCES [Cliente](id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS [Documento] (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT,
        descricao TEXT,
        processoId INTEGER,
        clienteId INTEGER,
        filePath TEXT,
        fileSize INTEGER,
        fileType TEXT,
        uploadedBy INTEGER,
        version INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (processoId) REFERENCES [Processo](id) ON DELETE SET NULL,
        FOREIGN KEY (clienteId) REFERENCES [Cliente](id) ON DELETE CASCADE,
        FOREIGN KEY (uploadedBy) REFERENCES [User](id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS [Pendencia] (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipoDocumento TEXT NOT NULL,
        clienteId INTEGER NOT NULL,
        dataLimite DATETIME NOT NULL,
        processoId INTEGER,
        statusCobranca TEXT,
        prioridade TEXT,
        observacoes TEXT,
        notified INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clienteId) REFERENCES [Cliente](id) ON DELETE CASCADE,
        FOREIGN KEY (processoId) REFERENCES [Processo](id) ON DELETE SET NULL
      );
    `;

    const sqlStatements = tables.split(';').filter(stmt => stmt.trim());
    
    for (const stmt of sqlStatements) {
      if (stmt.trim()) {
        await new Promise((resolve, reject) => {
          db.run(stmt, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    console.log('✅ Tabelas criadas com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err);
  }
}

export { connectDB, query, closeDB, initDB };
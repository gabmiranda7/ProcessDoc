import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import express from "express";

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }

    const exists = await query(
      'SELECT id FROM [User] WHERE email = @email',
      { email }
    );

    if (exists.recordset.length > 0) {
      return res.status(400).json({ error: "Email já registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO [User] (name, email, passwordHash, role, createdAt, updatedAt)
       VALUES (@name, @email, @passwordHash, @role, GETDATE(), GETDATE())
       SELECT SCOPE_IDENTITY() as id`,
      { name, email, passwordHash, role: role || 'ADVOGADO' }
    );

    const userId = result.recordset[0].id;
    const token = jwt.sign(
      { userId, email, role: role || 'ADVOGADO' },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      token,
      userId,
      role: role || 'ADVOGADO'
    });
  } catch (err) {
    console.error('❌ Erro no register:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const result = await query(
      'SELECT id, email, passwordHash, role, name FROM [User] WHERE email = @email',
      { email }
    );

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ 
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).json({ error: err.message });
  }
}

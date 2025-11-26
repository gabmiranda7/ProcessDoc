import { query } from "../config/db.js";

export async function cadastrarCliente(req, res) {
  try {
    // Só ADMIN pode cadastrar cliente
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode cadastrar clientes" });
    }

    const { nomeCompleto, cpf, telefone, email, endereco } = req.body;

    if (!nomeCompleto || !cpf || !telefone) {
      return res.status(400).json({ error: "Nome, CPF e telefone são obrigatórios" });
    }

    const existsCpf = await query(
      'SELECT id FROM [Cliente] WHERE cpf = @cpf',
      [cpf]
    );

    if (existsCpf.recordset.length > 0) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    const result = await query(
      `INSERT INTO [Cliente] (nomeCompleto, cpf, telefone, email, endereco, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [nomeCompleto, cpf, telefone, email || null, endereco || null]
    );

    const clienteId = result.recordset[0].id;

    res.status(201).json({
      message: "Cliente cadastrado com sucesso!",
      id: clienteId,
      nomeCompleto,
      cpf,
      telefone
    });
  } catch (err) {
    console.error('❌ Erro ao cadastrar cliente:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarClientes(req, res) {
  try {
    let result;

    // ADMIN vê todos os clientes
    if (req.user.role === 'ADMIN') {
      result = await query(
        'SELECT id, nomeCompleto, cpf, telefone, email, endereco, createdAt FROM [Cliente] ORDER BY createdAt DESC'
      );
    } 
    // CLIENTE vê só os dados dele
    else if (req.user.role === 'CLIENTE') {
      result = await query(
        'SELECT id, nomeCompleto, cpf, telefone, email, endereco, createdAt FROM [Cliente] WHERE id = @id',
        [req.user.clienteId]
      );
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Erro ao listar clientes:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function obterCliente(req, res) {
  try {
    const { id } = req.params;
    const clienteId = parseInt(id);

    // CLIENTE só pode ver os dados dele
    if (req.user.role === 'CLIENTE' && req.user.clienteId !== clienteId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const result = await query(
      'SELECT id, nomeCompleto, cpf, telefone, email, endereco, createdAt FROM [Cliente] WHERE id = @id',
      [clienteId]
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Erro ao obter cliente:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletarCliente(req, res) {
  try {
    // Só ADMIN pode deletar
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode deletar clientes" });
    }

    const { id } = req.params;

    await query(
      'DELETE FROM [Cliente] WHERE id = @id',
      [parseInt(id)]
    );

    res.json({ message: "Cliente removido com sucesso!" });
  } catch (err) {
    console.error('❌ Erro ao deletar cliente:', err);
    res.status(500).json({ error: err.message });
  }
}
export async function cadastrarProcesso(req, res) {
  try {
    // Só ADMIN pode cadastrar processo
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode cadastrar processos" });
    }

    const { numero, tribunal, vara, natureza, clienteId, status, prazo, observacoes } = req.body;

    if (!numero || !tribunal || !natureza) {
      return res.status(400).json({ error: "Número, tribunal e natureza são obrigatórios" });
    }

    const exists = await query(
      'SELECT id FROM [Processo] WHERE numero = @numero',
      [numero]
    );

    if (exists.recordset.length > 0) {
      return res.status(400).json({ error: "Processo com este número já existe" });
    }

    const result = await query(
      `INSERT INTO [Processo] (numero, tribunal, vara, natureza, clienteId, status, prazo, observacoes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [numero, tribunal, vara || null, natureza, clienteId || null, status || 'ABERTO', prazo || null, observacoes || null]
    );

    const processoId = result.recordset[0].id;

    res.status(201).json({
      message: "Processo cadastrado com sucesso!",
      id: processoId,
      numero,
      tribunal,
      natureza
    });
  } catch (err) {
    console.error('❌ Erro ao cadastrar processo:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarProcessos(req, res) {
  try {
    let result;

    // ADMIN vê todos os processos
    if (req.user.role === 'ADMIN') {
      result = await query(
        `SELECT p.id, p.numero, p.tribunal, p.vara, p.natureza, p.status, p.prazo, 
                p.observacoes, c.nomeCompleto, p.createdAt
         FROM [Processo] p
         LEFT JOIN [Cliente] c ON p.clienteId = c.id
         ORDER BY p.createdAt DESC`
      );
    } 
    // CLIENTE vê só os processos dele
    else if (req.user.role === 'CLIENTE') {
      result = await query(
        `SELECT p.id, p.numero, p.tribunal, p.vara, p.natureza, p.status, p.prazo, 
                p.observacoes, c.nomeCompleto, p.createdAt
         FROM [Processo] p
         LEFT JOIN [Cliente] c ON p.clienteId = c.id
         WHERE p.clienteId = @clienteId
         ORDER BY p.createdAt DESC`,
        [req.user.clienteId]
      );
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Erro ao listar processos:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletarProcesso(req, res) {
  try {
    // Só ADMIN pode deletar
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode deletar processos" });
    }

    const { id } = req.params;

    await query(
      'DELETE FROM [Processo] WHERE id = @id',
      [parseInt(id)]
    );

    res.json({ message: "Processo removido com sucesso!" });
  } catch (err) {
    console.error('❌ Erro ao deletar processo:', err);
    res.status(500).json({ error: err.message });
  }
}
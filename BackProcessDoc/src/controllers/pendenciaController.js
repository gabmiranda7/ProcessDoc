export async function cadastrarPendencia(req, res) {
  try {
    // Só ADMIN pode cadastrar pendência
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode cadastrar pendências" });
    }

    const { tipoDocumento, clienteId, dataLimite, processoId, statusCobranca, prioridade, observacoes } = req.body;

    if (!tipoDocumento || !clienteId || !dataLimite) {
      return res.status(400).json({ error: "Tipo documento, cliente e data limite são obrigatórios" });
    }

    const result = await query(
      `INSERT INTO [Pendencia] (tipoDocumento, clienteId, dataLimite, processoId, statusCobranca, prioridade, observacoes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [tipoDocumento, parseInt(clienteId), new Date(dataLimite), processoId ? parseInt(processoId) : null, statusCobranca || null, prioridade || null, observacoes || null]
    );

    const pendenciaId = result.recordset[0].id;

    res.status(201).json({
      message: "Pendência cadastrada com sucesso!",
      id: pendenciaId,
      tipoDocumento,
      dataLimite
    });
  } catch (err) {
    console.error('❌ Erro ao cadastrar pendência:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarPendencias(req, res) {
  try {
    let result;

    // ADMIN vê todas as pendências
    if (req.user.role === 'ADMIN') {
      result = await query(
        `SELECT p.id, p.tipoDocumento, p.dataLimite, p.statusCobranca, p.prioridade, p.observacoes, p.notified,
                c.nomeCompleto, pr.numero as processoNumero, p.createdAt
         FROM [Pendencia] p
         LEFT JOIN [Cliente] c ON p.clienteId = c.id
         LEFT JOIN [Processo] pr ON p.processoId = pr.id
         ORDER BY p.dataLimite ASC`
      );
    } 
    // CLIENTE vê só as pendências dele
    else if (req.user.role === 'CLIENTE') {
      result = await query(
        `SELECT p.id, p.tipoDocumento, p.dataLimite, p.statusCobranca, p.prioridade, p.observacoes, p.notified,
                c.nomeCompleto, pr.numero as processoNumero, p.createdAt
         FROM [Pendencia] p
         LEFT JOIN [Cliente] c ON p.clienteId = c.id
         LEFT JOIN [Processo] pr ON p.processoId = pr.id
         WHERE p.clienteId = @clienteId
         ORDER BY p.dataLimite ASC`,
        [req.user.clienteId]
      );
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Erro ao listar pendências:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletarPendencia(req, res) {
  try {
    // Só ADMIN pode deletar
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode deletar pendências" });
    }

    const { id } = req.params;

    await query(
      'DELETE FROM [Pendencia] WHERE id = @id',
      [parseInt(id)]
    );

    res.json({ message: "Pendência removida com sucesso!" });
  } catch (err) {
    console.error('❌ Erro ao deletar pendência:', err);
    res.status(500).json({ error: err.message });
  }
}
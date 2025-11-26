export async function cadastrarDocumento(req, res) {
  try {
    const { nome, tipo, descricao, processoId, clienteId } = req.body;
    const uploadedBy = req.user.userId;

    if (!nome) {
      return res.status(400).json({ error: "Nome do documento é obrigatório" });
    }

    // CLIENTE só pode enviar documento pra si mesmo
    if (req.user.role === 'CLIENTE' && clienteId && clienteId !== req.user.clienteId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const result = await query(
      `INSERT INTO [Documento] (nome, tipo, descricao, processoId, clienteId, uploadedBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [nome, tipo || null, descricao || null, processoId || null, clienteId || null, uploadedBy]
    );

    const documentoId = result.recordset[0].id;

    res.status(201).json({
      message: "Documento cadastrado com sucesso!",
      id: documentoId,
      nome,
      tipo
    });
  } catch (err) {
    console.error('❌ Erro ao cadastrar documento:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarDocumentos(req, res) {
  try {
    let result;

    // ADMIN vê todos os documentos
    if (req.user.role === 'ADMIN') {
      result = await query(
        `SELECT d.id, d.nome, d.tipo, d.descricao, d.version, d.createdAt,
                c.nomeCompleto, p.numero as processoNumero
         FROM [Documento] d
         LEFT JOIN [Cliente] c ON d.clienteId = c.id
         LEFT JOIN [Processo] p ON d.processoId = p.id
         ORDER BY d.createdAt DESC`
      );
    } 
    // CLIENTE vê só os documentos dele
    else if (req.user.role === 'CLIENTE') {
      result = await query(
        `SELECT d.id, d.nome, d.tipo, d.descricao, d.version, d.createdAt,
                c.nomeCompleto, p.numero as processoNumero
         FROM [Documento] d
         LEFT JOIN [Cliente] c ON d.clienteId = c.id
         LEFT JOIN [Processo] p ON d.processoId = p.id
         WHERE d.clienteId = @clienteId
         ORDER BY d.createdAt DESC`,
        [req.user.clienteId]
      );
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Erro ao listar documentos:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletarDocumento(req, res) {
  try {
    // Só ADMIN pode deletar
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Apenas ADM pode deletar documentos" });
    }

    const { id } = req.params;

    await query(
      'DELETE FROM [Documento] WHERE id = @id',
      [parseInt(id)]
    );

    res.json({ message: "Documento removido com sucesso!" });
  } catch (err) {
    console.error('❌ Erro ao deletar documento:', err);
    res.status(500).json({ error: err.message });
  }
}
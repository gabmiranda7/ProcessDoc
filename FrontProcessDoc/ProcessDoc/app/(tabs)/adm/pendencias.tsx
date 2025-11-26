import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import MaskInput from "react-native-mask-input";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function CadastrarPendenciaScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [cliente, setCliente] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [processoAssociado, setProcessoAssociado] = useState("");
  const [statusCobranca, setStatusCobranca] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<'tipo' | 'status' | 'prioridade' | null>(null);
  const [modalOpcoes, setModalOpcoes] = useState<string[]>([]);

  const tiposDocumento = ["CPF", "RG", "Certidão de Nascimento", "Comprovante de Residência", "Certidão de Casamento", "Procuração", "Contrato Social"];
  const statusCobrancas = ["Aguardando Cliente", "Solicitado", "Em Cobrança", "Urgente", "Vencido"];
  const prioridades = ["Baixa", "Média", "Alta", "Urgente"];

  const dataMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  const abrirModal = (tipo: 'tipo' | 'status' | 'prioridade') => {
    setModalTipo(tipo);
    if (tipo === 'tipo') {
      setModalOpcoes(tiposDocumento);
    } else if (tipo === 'status') {
      setModalOpcoes(statusCobrancas);
    } else {
      setModalOpcoes(prioridades);
    }
    setModalVisible(true);
  };

  const selecionarOpcao = (opcao: string) => {
    if (modalTipo === 'tipo') {
      setTipoDocumento(opcao);
    } else if (modalTipo === 'status') {
      setStatusCobranca(opcao);
    } else if (modalTipo === 'prioridade') {
      setPrioridade(opcao);
    }
    setModalVisible(false);
  };

  const getValorSelecionado = () => {
    if (modalTipo === 'tipo') return tipoDocumento;
    if (modalTipo === 'status') return statusCobranca;
    if (modalTipo === 'prioridade') return prioridade;
    return "";
  };

  const buscarCliente = async () => {
    if (!cliente.trim()) {
      Alert.alert("Erro", "Digite o nome do cliente");
      return;
    }

    try {
      setLoading(true);
      const response = await api.clientes.listar();
      const clienteEncontrado = response.find((c: any) =>
        c.nomeCompleto.toLowerCase().includes(cliente.toLowerCase())
      );

      if (clienteEncontrado) {
        setCliente(clienteEncontrado.nomeCompleto);
        Alert.alert("Sucesso", `Cliente encontrado: ${clienteEncontrado.nomeCompleto}`);
      } else {
        Alert.alert("Erro", "Cliente não encontrado");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao buscar cliente");
    } finally {
      setLoading(false);
    }
  };

  const buscarProcesso = async () => {
    if (!processoAssociado.trim()) {
      Alert.alert("Erro", "Digite o número do processo");
      return;
    }

    try {
      setLoading(true);
      // await api.processos.buscar(processoAssociado);
      Alert.alert("Processo encontrado", `Processo: ${processoAssociado}`);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Processo não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarPendencia = async () => {
    if (!tipoDocumento || !cliente || !dataLimite) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dataRegex.test(dataLimite)) {
      Alert.alert("Erro", "Por favor, digite uma data válida no formato DD/MM/AAAA.");
      return;
    }

    try {
      setLoading(true);
      // await api.pendencias.cadastrar({
      //   tipoDocumento,
      //   cliente,
      //   dataLimite,
      //   processoAssociado,
      //   statusCobranca,
      //   prioridade,
      //   observacoes,
      // });
      Alert.alert("Sucesso", "Pendência cadastrada com sucesso!");
      limparFormulario();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar pendência");
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setTipoDocumento("");
    setCliente("");
    setDataLimite("");
    setProcessoAssociado("");
    setStatusCobranca("");
    setPrioridade("");
    setObservacoes("");
  };

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1E40AF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Cadastrar Pendência</Text>
        </View>
      </View>

      {/* Modal de Seleção */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalTipo === 'tipo' && 'Selecione o Tipo de Documento'}
                {modalTipo === 'status' && 'Selecione o Status'}
                {modalTipo === 'prioridade' && 'Selecione a Prioridade'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {modalOpcoes.map((opcao, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => selecionarOpcao(opcao)}
                >
                  <Text style={styles.modalItemText}>{opcao}</Text>
                  {getValorSelecionado() === opcao && (
                    <Feather name="check" size={20} color="#1E40AF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Cadastro de Pendência de Documento</Text>

          {/* Tipo de Documento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Documento *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => abrirModal('tipo')}
              disabled={loading}
            >
              <Text style={{ color: tipoDocumento ? "#333" : "#888" }}>
                {tipoDocumento || "Selecione o tipo"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Cliente */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cliente *</Text>
            <View style={styles.rowInputWithButton}>
              <TextInput
                style={styles.inputWithButton}
                placeholder="Digite o nome do cliente"
                placeholderTextColor="#888"
                value={cliente}
                onChangeText={setCliente}
                editable={!loading}
              />
              <TouchableOpacity style={styles.searchButton} onPress={buscarCliente} disabled={loading}>
                <Feather name="search" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Data Limite */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Limite para Entrega *</Text>
            <MaskInput
              mask={dataMask}
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={dataLimite}
              onChangeText={setDataLimite}
              editable={!loading}
            />
          </View>

          {/* Processo Associado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Processo Associado</Text>
            <View style={styles.rowInputWithButton}>
              <TextInput
                style={styles.inputWithButton}
                placeholder="Digite o número do processo"
                placeholderTextColor="#888"
                value={processoAssociado}
                onChangeText={setProcessoAssociado}
                editable={!loading}
              />
              <TouchableOpacity style={styles.searchButton} onPress={buscarProcesso} disabled={loading}>
                <Feather name="search" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status da Cobrança */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status da Cobrança</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => abrirModal('status')}
              disabled={loading}
            >
              <Text style={{ color: statusCobranca ? "#333" : "#888" }}>
                {statusCobranca || "Selecione o status"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Prioridade */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => abrirModal('prioridade')}
              disabled={loading}
            >
              <Text style={{ color: prioridade ? "#333" : "#888" }}>
                {prioridade || "Selecione a prioridade"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Observações */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observações sobre a pendência..."
              placeholderTextColor="#888"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>

          {/* Botões de Ação */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.buttonCancel, loading && styles.buttonDisabled]} 
              onPress={limparFormulario}
              disabled={loading}
            >
              <Feather name="x" size={20} color="#666" />
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.buttonSave, loading && styles.buttonDisabled]} 
              onPress={handleCadastrarPendencia}
              disabled={loading}
            >
              <Feather name="save" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>
                {loading ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#E9F2FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 40,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 34,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 100,
  },
  formCard: {
    width: width * 0.9,
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: 16,
  },
  inputWithButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  rowInputWithButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchButton: {
    backgroundColor: "#1E40AF",
    padding: 12,
    borderRadius: 8,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    width: width * 0.85,
    maxWidth: 400,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E40AF",
    flex: 1,
    marginRight: 10,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  buttonCancel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 8,
  },
  buttonCancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSave: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E40AF",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
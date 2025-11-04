import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function CadastrarPendenciaScreen() {
  const router = useRouter();

  // Estados do formulário
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [dropdownTipoOpen, setDropdownTipoOpen] = useState(false);
  const [cliente, setCliente] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [processoAssociado, setProcessoAssociado] = useState("");
  const [statusCobranca, setStatusCobranca] = useState("");
  const [dropdownStatusOpen, setDropdownStatusOpen] = useState(false);
  const [prioridade, setPrioridade] = useState("");
  const [dropdownPrioridadeOpen, setDropdownPrioridadeOpen] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  // Dropdowns fixos
  const tiposDocumento = [
    "CPF",
    "RG",
    "Certidão de Nascimento",
    "Comprovante de Residência",
    "Certidão de Casamento",
    "Procuração",
    "Contrato Social",
  ];
  const statusCobrancas = ["Aguardando Cliente", "Solicitado", "Em Cobrança", "Urgente", "Vencido"];
  const prioridades = ["Baixa", "Média", "Alta", "Urgente"];

  // Função para aplicar máscara de data DD/MM/AAAA
  const handleDataLimiteChange = (text: string) => {
    // Remove tudo que não é número
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // Adiciona as barras automaticamente
    if (cleaned.length >= 5) cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    else if (cleaned.length >= 3) cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");

    setDataLimite(cleaned);
  };

  const handleSubmit = () => {
    if (!tipoDocumento || !cliente || !dataLimite) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    // Aqui você integraria com o backend
    const payload = {
      tipoDocumento,
      cliente,
      dataLimite,
      processoAssociado,
      statusCobranca,
      prioridade,
      observacoes,
    };

    console.log("Enviar para backend:", payload);
    Alert.alert("Sucesso", "Pendência cadastrada!");
    router.back();
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#007BFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image source={require("../assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Process Doc</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Cadastro de Pendência de Documento</Text>

          {/* Tipo de Documento */}
          <View style={[styles.inputGroup, { zIndex: dropdownTipoOpen ? 9999 : 1 }]}>
            <Text style={styles.label}>Tipo de Documento *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownTipoOpen(!dropdownTipoOpen)}>
              <Text style={{ color: tipoDocumento ? "#333" : "#888" }}>
                {tipoDocumento || "Selecione o tipo de documento"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {dropdownTipoOpen && (
              <View style={styles.dropdownList}>
                {tiposDocumento.map(tipo => (
                  <TouchableOpacity
                    key={tipo}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTipoDocumento(tipo);
                      setDropdownTipoOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{tipo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Cliente */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cliente *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do cliente"
              placeholderTextColor="#888"
              value={cliente}
              onChangeText={setCliente}
            />
          </View>

          {/* Data Limite */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Limite para Entrega *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#888"
              value={dataLimite}
              onChangeText={handleDataLimiteChange}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          {/* Processo Associado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Processo Associado</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o número do processo"
              placeholderTextColor="#888"
              value={processoAssociado}
              onChangeText={setProcessoAssociado}
            />
          </View>

          {/* Status da Cobrança */}
          <View style={[styles.inputGroup, { zIndex: dropdownStatusOpen ? 9998 : 1 }]}>
            <Text style={styles.label}>Status da Cobrança</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownStatusOpen(!dropdownStatusOpen)}>
              <Text style={{ color: statusCobranca ? "#333" : "#888" }}>
                {statusCobranca || "Selecione o status"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {dropdownStatusOpen && (
              <View style={styles.dropdownList}>
                {statusCobrancas.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setStatusCobranca(status);
                      setDropdownStatusOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Prioridade */}
          <View style={[styles.inputGroup, { zIndex: dropdownPrioridadeOpen ? 9997 : 1 }]}>
            <Text style={styles.label}>Prioridade</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownPrioridadeOpen(!dropdownPrioridadeOpen)}>
              <Text style={{ color: prioridade ? "#333" : "#888" }}>
                {prioridade || "Selecione a prioridade"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {dropdownPrioridadeOpen && (
              <View style={styles.dropdownList}>
                {prioridades.map(prio => (
                  <TouchableOpacity
                    key={prio}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPrioridade(prio);
                      setDropdownPrioridadeOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{prio}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={limparFormulario}>
              <Feather name="x" size={20} color="#FFF" />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Feather name="check" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>Cadastrar Pendência</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: "#E0F2F7" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E0E0E0", paddingTop: 40 },
  backButton: { paddingRight: 10 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "center", marginRight: 34 },
  headerLogo: { width: 30, height: 30, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingVertical: 20 },
  formCard: { width: width * 0.9, maxWidth: 600, backgroundColor: "#FFF", borderRadius: 15, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#007BFF", textAlign: "center", marginBottom: 20 },
  inputGroup: { marginBottom: 15, position: "relative" },
  label: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8, color: "#333", fontSize: 16 },
  textArea: { height: 100, paddingTop: 12 },
  dropdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8 },
  dropdownList: { position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, marginTop: 2, zIndex: 10000, elevation: 10 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  dropdownItemText: { color: "#333", fontSize: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  clearButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6C757D", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 0.45, justifyContent: "center" },
  clearButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  submitButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#007BFF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 0.45, justifyContent: "center" },
  submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});

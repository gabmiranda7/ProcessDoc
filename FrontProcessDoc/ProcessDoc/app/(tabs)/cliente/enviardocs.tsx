import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function CadastroDocumentosADM() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const tipos = ["Todos", "CPF", "Certidão", "Identidade", "Endereço", "Intimação"];

  const [formData, setFormData] = useState({
    nomeDocumento: "",
    tipoDocumento: "",
    numeroProcesso: "",
  });

  const [documentosAnexados, setDocumentosAnexados] = useState<{
    [key: string]: boolean;
  }>({});

  const icones: { [key: string]: any } = {
    CPF: "card-account-details",
    Certidão: "file-document",
    Identidade: "account-box",
    Endereço: "home-city",
    Intimação: "alert",
    Todos: "check-all",
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const selecionarTipo = (tipo: string) => {
    handleChange("tipoDocumento", tipo);
    setModalVisible(false);
  };

  const selecionarArquivo = (tipo: string) => {
    Alert.alert("Anexar Arquivo", `Função de upload para ${tipo} será implementada`);
  };

  const validarCampos = () => {
    if (!formData.nomeDocumento.trim()) {
      Alert.alert("Erro", "Nome do documento é obrigatório");
      return false;
    }
    if (!formData.tipoDocumento) {
      Alert.alert("Erro", "Tipo de documento é obrigatório");
      return false;
    }
    return true;
  };

  const handleCadastrar = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);
      // await api.documentos.cadastrar(formData);
      Alert.alert("Sucesso", "Documento cadastrado com sucesso!");
      setFormData({
        nomeDocumento: "",
        tipoDocumento: "",
        numeroProcesso: "",
      });
      setDocumentosAnexados({});
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar documento");
    } finally {
      setLoading(false);
    }
  };

  const tiposParaMostrar =
    formData.tipoDocumento === "Todos"
      ? tipos.filter(t => t !== "Todos")
      : formData.tipoDocumento
      ? [formData.tipoDocumento]
      : [];

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cliente/inicio")}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#1E40AF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Process Doc</Text>
        </View>
      </View>

      {/* Modal de Seleção de Tipo */}
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
              <Text style={styles.modalTitle}>Selecione o Tipo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {tipos.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={styles.modalItem}
                  onPress={() => selecionarTipo(tipo)}
                >
                  <MaterialCommunityIcons
                    name={icones[tipo]}
                    size={20}
                    color="#1E40AF"
                  />
                  <Text style={styles.modalItemText}>{tipo}</Text>
                  {formData.tipoDocumento === tipo && (
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
          <Text style={styles.title}>Cadastrar Documento</Text>
          <Text style={styles.subtitle}>Preencha os dados do documento</Text>

          {/* Nome do Documento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Documento *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Contrato Social, Procuração"
              placeholderTextColor="#888"
              value={formData.nomeDocumento}
              onChangeText={(t) => handleChange("nomeDocumento", t)}
              editable={!loading}
            />
          </View>

          {/* Tipo de Documento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Documento *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setModalVisible(true)}
              disabled={loading}
            >
              <View style={styles.dropdownContent}>
                {formData.tipoDocumento && (
                  <MaterialCommunityIcons
                    name={icones[formData.tipoDocumento]}
                    size={20}
                    color="#1E40AF"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text
                  style={[
                    styles.dropdownText,
                    { color: formData.tipoDocumento ? "#333" : "#888" },
                  ]}
                >
                  {formData.tipoDocumento || "Selecione o tipo"}
                </Text>
              </View>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Número do Processo (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número do Processo (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 0000000-00.0000.0.00.0000"
              placeholderTextColor="#888"
              value={formData.numeroProcesso}
              onChangeText={(t) => handleChange("numeroProcesso", t)}
              editable={!loading}
            />
          </View>

          {/* Botões de Anexar Documentos */}
          {tiposParaMostrar.length > 0 && (
            <View style={styles.attachmentContainer}>
              <Text style={styles.label}>Anexar Documentos</Text>
              <View style={styles.buttonsRow}>
                {tiposParaMostrar.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={styles.anexarButton}
                    onPress={() => selecionarArquivo(tipo)}
                    disabled={loading}
                  >
                    <MaterialCommunityIcons
                      name={icones[tipo]}
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.anexarButtonText}>{tipo}</Text>
                    {documentosAnexados[tipo] && (
                      <Feather name="check-circle" size={14} color="#4ADE80" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Botões de Ação */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => router.push("/(tabs)/cliente/inicio")}
              disabled={loading}
            >
              <Feather name="x" size={20} color="#666" />
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonSave,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleCadastrar}
              disabled={loading}
            >
              <Feather name="save" size={20} color="#fff" />
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 34,
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 12,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
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
    maxHeight: "60%",
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
  },
  modalScroll: {
    maxHeight: 350,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  attachmentContainer: {
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  buttonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  anexarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  anexarButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  buttonSave: {
    backgroundColor: "#1E40AF",
  },
  buttonCancel: {
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonCancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
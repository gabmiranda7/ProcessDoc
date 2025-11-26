import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function SolicitarAlteracao() {
  const router = useRouter();

  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const enviarSolicitacao = async () => {
    if (!tipo || !descricao.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      
      await api.post('/solicitacoes', {
        tipo,
        descricao,
        arquivo,
        dataSolicitacao: new Date().toISOString(),
      });

      Alert.alert(
        "Sucesso",
        "Solicitação enviada com sucesso! Aguarde o retorno do seu advogado.",
        [
          {
            text: "OK",
            onPress: () => {
              setTipo("");
              setDescricao("");
              setArquivo(null);
              router.push("/(tabs)/cliente/inicio");
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const selecionarArquivo = () => {
    Alert.alert(
      "Upload de Arquivo",
      "Funcionalidade em desenvolvimento. Em breve você poderá anexar documentos!",
      [{ text: "OK" }]
    );
  };

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="file-edit" size={32} color="#1E40AF" />
            <Text style={styles.title}>Solicitar Alteração</Text>
          </View>
          <Text style={styles.subtitle}>
            Preencha os campos abaixo para solicitar uma alteração em seus dados ou documentos
          </Text>

          {/* Formulário */}
          <View style={styles.formContent}>
            {/* Tipo de Solicitação */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Solicitação *</Text>
              <View style={styles.inputContainer}>
                <Feather name="list" size={18} color="#1E40AF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Atualização de documento, Correção de dados..."
                  placeholderTextColor="#888"
                  value={tipo}
                  onChangeText={setTipo}
                />
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição da Solicitação *</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Feather name="file-text" size={18} color="#1E40AF" style={styles.iconTop} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descreva detalhadamente o que você precisa alterar..."
                  placeholderTextColor="#888"
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Upload de Arquivo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Anexar Arquivo (Opcional)</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={selecionarArquivo}
              >
                <Feather name="upload" size={20} color="#1E40AF" />
                <Text style={styles.uploadText}>
                  {arquivo ? "Arquivo selecionado" : "Selecionar arquivo"}
                </Text>
                <Feather name="paperclip" size={18} color="#666" />
              </TouchableOpacity>
              <Text style={styles.helperText}>
                PDF, imagem ou documento (máx. 10MB)
              </Text>
            </View>
          </View>

          {/* Informação Adicional */}
          <View style={styles.infoBox}>
            <Feather name="info" size={20} color="#2563EB" />
            <Text style={styles.infoText}>
              Sua solicitação será analisada pelo advogado e você receberá uma resposta em breve.
            </Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={enviarSolicitacao}
              disabled={loading}
            >
              <Feather name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {loading ? "Enviando..." : "Enviar Solicitação"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.push("/(tabs)/cliente/inicio")}
              disabled={loading}
            >
              <Feather name="x" size={20} color="#666" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: "#E9F2FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 40,
  },
  backButton: { paddingRight: 10 },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 34,
  },
  headerLogo: { width: 30, height: 30, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1E40AF" },
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  formContent: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  iconTop: {
    marginRight: 10,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#1E40AF",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 16,
  },
  uploadText: {
    flex: 1,
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "600",
    marginLeft: 10,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    marginLeft: 2,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#2563EB",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
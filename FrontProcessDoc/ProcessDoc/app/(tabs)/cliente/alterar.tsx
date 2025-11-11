import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SolicitarAlteracao() {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState<string | null>(null);

  const enviarSolicitacao = () => {
    if (!tipo || !descricao.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    Alert.alert("✅ Sucesso", "Solicitação enviada com sucesso!");
    setTipo("");
    setDescricao("");
    setArquivo(null);
  };

  const selecionarArquivo = () => {
    Alert.alert("Função em desenvolvimento", "Upload de arquivo em breve!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Solicitar Alteração</Text>
      <Text style={styles.subtitle}>
        Preencha os campos abaixo para solicitar uma alteração em seus dados ou documentos.
      </Text>

      <View style={styles.formBox}>
        {/* Tipo de Solicitação */}
        <View style={styles.inputGroup}>
          <Feather name="list" size={18} color="#0052CC" />
          <TextInput
            style={styles.input}
            placeholder="Tipo de solicitação (ex: Documento, Dados pessoais...)"
            value={tipo}
            onChangeText={setTipo}
          />
        </View>

        {/* Descrição */}
        <View style={[styles.inputGroup, { alignItems: "flex-start" }]}>
          <Feather name="file-text" size={18} color="#0052CC" style={{ marginTop: 5 }} />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Descreva sua solicitação com detalhes..."
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />
        </View>

        {/* Upload de Arquivo */}
        <TouchableOpacity style={styles.uploadButton} onPress={selecionarArquivo}>
          <Feather name="upload" size={18} color="#fff" />
          <Text style={styles.uploadText}>
            {arquivo ? "Arquivo selecionado" : "Selecionar arquivo (opcional)"}
          </Text>
        </TouchableOpacity>

        {/* Enviar */}
        <TouchableOpacity style={styles.submitButton} onPress={enviarSolicitacao}>
          <Feather name="send" size={18} color="#fff" />
          <Text style={styles.submitText}>Enviar Solicitação</Text>
        </TouchableOpacity>

        {/* Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/cliente/inicio")}
        >
          <Feather name="arrow-left" size={18} color="#0052CC" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E9F2FF",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0052CC",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  formBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "95%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F6FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#B6C6E2",
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 8,
    fontSize: 15,
    color: "#333",
  },
  uploadButton: {
    backgroundColor: "#0052CC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  backText: {
    color: "#0052CC",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 15,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function ProcessosCadastrar() {
  const router = useRouter();

  const [numero, setNumero] = useState("");
  const [tribunal, setTribunal] = useState("");
  const [vara, setVara] = useState("");
  const [natureza, setNatureza] = useState("");
  const [cliente, setCliente] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  const formatarNumeroProcesso = (texto: string) => {
    // Remove tudo que não é número
    const numeros = texto.replace(/\D/g, "");
    
    // Aplica a máscara: 0000000-00.0000.0.00.0000
    let formatado = numeros;
    if (numeros.length > 7) {
      formatado = numeros.substring(0, 7) + "-" + numeros.substring(7);
    }
    if (numeros.length > 9) {
      formatado = formatado.substring(0, 10) + "." + formatado.substring(10);
    }
    if (numeros.length > 13) {
      formatado = formatado.substring(0, 15) + "." + formatado.substring(15);
    }
    if (numeros.length > 14) {
      formatado = formatado.substring(0, 17) + "." + formatado.substring(17);
    }
    if (numeros.length > 16) {
      formatado = formatado.substring(0, 20) + "." + formatado.substring(20);
    }
    
    return formatado.substring(0, 25); // Limita ao tamanho máximo
  };

  const handleNumeroChange = (texto: string) => {
    const formatado = formatarNumeroProcesso(texto);
    setNumero(formatado);
  };

  const handleCadastrar = async () => {
    if (!numero || !tribunal || !vara || !natureza || !cliente) {
      return Alert.alert("Atenção", "Preencha os campos obrigatórios.");
    }

    // Validar formato do número do processo (deve ter 20 dígitos)
    const numerosApenas = numero.replace(/\D/g, "");
    if (numerosApenas.length !== 20) {
      return Alert.alert(
        "Atenção",
        "O número do processo deve conter 20 dígitos.\nFormato: 0000000-00.0000.0.00.0000"
      );
    }

    try {
      setLoading(true);
      
      await api.processos.cadastrar({
        numero,
        tribunal,
        vara,
        natureza,
        cliente,
        observacoes,
      });
      
      Alert.alert(
        "Sucesso",
        "Processo cadastrado com sucesso!",
        [
          {
            text: "Cadastrar Outro",
            onPress: () => {
              // Limpa formulário
              setNumero("");
              setTribunal("");
              setVara("");
              setNatureza("");
              setCliente("");
              setObservacoes("");
            },
          },
          {
            text: "Ver Processos",
            onPress: () => router.push("/(tabs)/adm/visuprocessos"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar processo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/adm/adm")}
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
          <Text style={styles.title}>Cadastrar Processo</Text>

          {/* Formulário */}
          <View style={styles.formContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número do Processo *</Text>
              <View style={styles.inputContainer}>
                <Feather name="hash" size={18} color="#1E40AF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="0000000-00.0000.0.00.0000"
                  placeholderTextColor="#888"
                  value={numero}
                  onChangeText={handleNumeroChange}
                  keyboardType="numeric"
                  maxLength={25}
                />
              </View>
              <Text style={styles.helperText}>20 dígitos no formato padrão CNJ</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tribunal *</Text>
              <View style={styles.inputContainer}>
                <Feather name="briefcase" size={18} color="#1E40AF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: TJSP, TJRJ, STF"
                  placeholderTextColor="#888"
                  value={tribunal}
                  onChangeText={setTribunal}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vara / Comarca *</Text>
              <View style={styles.inputContainer}>
                <Feather name="map-pin" size={18} color="#1E40AF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite a vara ou comarca"
                  placeholderTextColor="#888"
                  value={vara}
                  onChangeText={setVara}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Natureza da Ação *</Text>
              <View style={styles.inputContainer}>
                <Feather name="file-text" size={18} color="#1E40AF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Cível, Criminal, Trabalhista"
                  placeholderTextColor="#888"
                  value={natureza}
                  onChangeText={setNatureza}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cliente Associado *</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={18} color="#1E40AF" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome do cliente"
                  placeholderTextColor="#888"
                  value={cliente}
                  onChangeText={setCliente}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Feather name="align-left" size={18} color="#1E40AF" style={styles.iconTop} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Adicione observações sobre o processo (opcional)"
                  placeholderTextColor="#888"
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Botão de Cadastrar */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleCadastrar}
            disabled={loading}
          >
            <Feather name="check" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {loading ? "Cadastrando..." : "Cadastrar Processo"}
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 25,
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
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginLeft: 2,
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
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },
});
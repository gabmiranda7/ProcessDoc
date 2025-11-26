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
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function CadastroClientes() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    senha: "",
  });

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .slice(0, 14);
    }

    if (field === "telefone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }

    setCliente({ ...cliente, [field]: formattedValue });
  };

  const validarCampos = () => {
    if (!cliente.nomeCompleto.trim()) {
      Alert.alert("Erro", "Nome completo é obrigatório");
      return false;
    }
    if (!cliente.cpf.trim()) {
      Alert.alert("Erro", "CPF é obrigatório");
      return false;
    }
    if (!cliente.telefone.trim()) {
      Alert.alert("Erro", "Telefone é obrigatório");
      return false;
    }
    if (!cliente.senha.trim()) {
      Alert.alert("Erro", "Senha é obrigatória");
      return false;
    }
    if (cliente.senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    return true;
  };

  const handleCadastrar = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);
      await api.clientes.cadastrar(cliente);
      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
      setCliente({
        nomeCompleto: "",
        cpf: "",
        telefone: "",
        email: "",
        endereco: "",
        senha: "",
      });
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar cliente");
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
          <Text style={styles.title}>Cadastrar Cliente</Text>
          <Text style={styles.subtitle}>Preencha os dados do novo cliente</Text>

          {/* Nome Completo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome completo"
              placeholderTextColor="#888"
              value={cliente.nomeCompleto}
              onChangeText={(t) => handleChange("nomeCompleto", t)}
              editable={!loading}
            />
          </View>

          {/* CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF *</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#888"
              value={cliente.cpf}
              onChangeText={(t) => handleChange("cpf", t)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#888"
              value={cliente.senha}
              onChangeText={(t) => handleChange("senha", t)}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Telefone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone *</Text>
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              placeholderTextColor="#888"
              value={cliente.telefone}
              onChangeText={(t) => handleChange("telefone", t)}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="cliente@exemplo.com"
              placeholderTextColor="#888"
              value={cliente.email}
              onChangeText={(t) => handleChange("email", t)}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Endereço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Rua, número, complemento, bairro, cidade, estado"
              placeholderTextColor="#888"
              value={cliente.endereco}
              onChangeText={(t) => handleChange("endereco", t)}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>


          {/* Botões */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => router.push("/(tabs)/adm/visuclientes")}
              disabled={loading}
            >
              <Feather name="x" size={20} color="#666" />
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSave, loading && styles.buttonDisabled]}
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
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
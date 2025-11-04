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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import MaskInput, { Masks } from "react-native-mask-input";
import { clientesApi } from "../api"; // usa o módulo que criamos

const { width } = Dimensions.get("window");

export default function ClientesScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    endereco: "",
    telefone: "",
    processo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegisterClient = async () => {
    // validações mínimas
    if (!form.nomeCompleto || !form.cpf) {
      Alert.alert("Atenção", "Preencha pelo menos Nome e CPF.");
      return;
    }

    setLoading(true);
    try {
      // tenta cadastrar na API; se a API não estiver no ar, vai cair no catch
      await clientesApi.cadastrar({
        nomeCompleto: form.nomeCompleto,
        dataNascimento: form.dataNascimento,
        cpf: form.cpf,
        endereco: form.endereco,
        telefone: form.telefone,
        processo: form.processo,
      });

      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
      // opcional: limpar formulário ou navegar
      router.back();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o cliente. (Se o backend não estiver rodando, isso é esperado.)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#007BFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Process Doc</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Cadastro de Cliente</Text>

          <View style={styles.formFieldsContainerFullWidth}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do cliente"
                placeholderTextColor="#888"
                value={form.nomeCompleto}
                onChangeText={(t) => handleChange("nomeCompleto", t)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <MaskInput
                mask={Masks.DATE_DDMMYYYY}
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={form.dataNascimento}
                onChangeText={(masked) => handleChange("dataNascimento", masked)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <MaskInput
                mask={Masks.BRL_CPF}
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={form.cpf}
                onChangeText={(masked) => handleChange("cpf", masked)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro"
                placeholderTextColor="#888"
                value={form.endereco}
                onChangeText={(t) => handleChange("endereco", t)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <MaskInput
                mask={Masks.BRL_PHONE}
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={form.telefone}
                onChangeText={(masked) => handleChange("telefone", masked)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Processo (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Número do processo associado"
                placeholderTextColor="#888"
                value={form.processo}
                onChangeText={(t) => handleChange("processo", t)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterClient}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Cadastrar Cliente</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#E0F2F7",
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
    color: "#007BFF",
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
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 20,
  },
  formFieldsContainerFullWidth: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
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
  registerButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
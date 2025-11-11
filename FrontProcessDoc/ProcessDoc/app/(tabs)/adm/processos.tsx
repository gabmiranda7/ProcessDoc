import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProcessosCadastrar() {
  const router = useRouter();

  const [numero, setNumero] = useState("");
  const [tribunal, setTribunal] = useState("");
  const [vara, setVara] = useState("");
  const [natureza, setNatureza] = useState("");
  const [cliente, setCliente] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleCadastrar = () => {
    if (!numero || !tribunal || !vara || !natureza || !cliente) {
      return Alert.alert("Atenção", "Preencha os campos obrigatórios.");
    }

    // TODO: integrar com API/backend (mock por enquanto)
    console.log("Cadastrar processo:", { numero, tribunal, vara, natureza, cliente, observacoes });
    Alert.alert("Sucesso", "Processo cadastrado com sucesso!");
    // limpa formulário
    setNumero("");
    setTribunal("");
    setVara("");
    setNatureza("");
    setCliente("");
    setObservacoes("");
    router.push("/(tabs)/adm/adm");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Processo</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Feather name="hash" size={18} color="#1E40AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Número do processo"
            placeholderTextColor="#888"
            value={numero}
            onChangeText={setNumero}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="briefcase" size={18} color="#1E40AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tribunal (ex: TJSP)"
            placeholderTextColor="#888"
            value={tribunal}
            onChangeText={setTribunal}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="map-pin" size={18} color="#1E40AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Vara / Comarca"
            placeholderTextColor="#888"
            value={vara}
            onChangeText={setVara}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="file-text" size={18} color="#1E40AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Natureza da ação (ex: Cível)"
            placeholderTextColor="#888"
            value={natureza}
            onChangeText={setNatureza}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="user" size={18} color="#1E40AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Cliente associado"
            placeholderTextColor="#888"
            value={cliente}
            onChangeText={setCliente}
          />
        </View>

        <View style={[styles.inputGroup, { alignItems: "flex-start" }]}>
          <Feather name="align-left" size={18} color="#1E40AF" style={styles.icon} />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Observações (opcional)"
            placeholderTextColor="#888"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleCadastrar}>
          <Feather name="check" size={18} color="#FFF" />
          <Text style={styles.submitButtonText}>Cadastrar Processo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#E9F2FF", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1E40AF" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    elevation: 3,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    marginBottom: 12,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#222" },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#1E40AF",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

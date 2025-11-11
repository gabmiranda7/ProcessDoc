import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Pendencias() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");

  const handleSalvar = () => {
    if (!titulo || !descricao || !prazo) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    Alert.alert("Sucesso", "Pendência cadastrada com sucesso!");
    setTitulo("");
    setDescricao("");
    setPrazo("");
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Pendência</Text>
      </View>

      {/* Campos */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Feather name="file-text" size={20} color="#1E40AF" style={styles.icon} />
          <TextInput
            placeholder="Título"
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="align-left" size={20} color="#1E40AF" style={styles.icon} />
          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 90 }]}
            multiline
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="calendar" size={20} color="#1E40AF" style={styles.icon} />
          <TextInput
            placeholder="Prazo (ex: 20/11/2025)"
            style={styles.input}
            value={prazo}
            onChangeText={setPrazo}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
          <Feather name="save" size={20} color="#FFF" />
          <Text style={styles.btnText}>Salvar Pendência</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F2FF", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25, gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1E40AF" },
  form: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, elevation: 3 },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 20,
    paddingBottom: 8,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#333" },
  btnSalvar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E40AF",
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});

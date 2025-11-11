import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Documentos() {
  const router = useRouter();
  const [documento, setDocumento] = useState({
    nome: "",
    tipo: "",
    descricao: "",
  });

  const handleChange = (field: string, value: string) => {
    setDocumento({ ...documento, [field]: value });
  };

  const handleCadastrar = async () => {
    alert("📎 Documento cadastrado com sucesso!");
    setDocumento({ nome: "", tipo: "", descricao: "" });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Documento</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome do Documento</Text>
        <TextInput
          style={styles.input}
          value={documento.nome}
          onChangeText={(t) => handleChange("nome", t)}
        />

        <Text style={styles.label}>Tipo</Text>
        <TextInput
          style={styles.input}
          value={documento.tipo}
          onChangeText={(t) => handleChange("tipo", t)}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={documento.descricao}
          onChangeText={(t) => handleChange("descricao", t)}
        />

        <TouchableOpacity style={styles.iconButton} onPress={handleCadastrar}>
          <Feather name="upload" size={22} color="#FFF" />
          <Text style={styles.iconText}>Enviar Documento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F2FF", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1E40AF" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F8FAFC",
  },
  iconButton: {
    flexDirection: "row",
    backgroundColor: "#1E40AF",
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconText: { color: "#FFF", fontWeight: "600" },
});

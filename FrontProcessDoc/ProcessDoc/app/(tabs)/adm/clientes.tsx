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
import api from "../../../api";


export default function Clientes() {
  const router = useRouter();
  const [cliente, setCliente] = useState({
    nomeCompleto: "",
    cpf: "",
    telefone: "",
  });

  const handleChange = (field: string, value: string) => {
    setCliente({ ...cliente, [field]: value });
  };

  const handleCadastrar = async () => {
    await api.clientes.cadastrar(cliente);
    alert("Cliente cadastrado com sucesso!");
    setCliente({ nomeCompleto: "", cpf: "", telefone: "" });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Cliente</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={cliente.nomeCompleto}
          onChangeText={(t) => handleChange("nomeCompleto", t)}
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          value={cliente.cpf}
          onChangeText={(t) => handleChange("cpf", t)}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={cliente.telefone}
          onChangeText={(t) => handleChange("telefone", t)}
        />

        <TouchableOpacity style={styles.iconButton} onPress={handleCadastrar}>
          <Feather name="save" size={22} color="#FFF" />
          <Text style={styles.iconText}>Salvar</Text>
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

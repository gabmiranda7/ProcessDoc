import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function AdmGerenciarClientes() {
  const [cpf, setCpf] = useState("");
  const [cliente, setCliente] = useState<any>(null);

  const buscarCliente = () => {
    if (cpf.trim() === "") return Alert.alert("Atenção", "Digite um CPF válido.");
    // Mock simples
    if (cpf === "111.111.111-11") {
      setCliente({
        nome: "Maria Oliveira",
        email: "maria@teste.com",
        telefone: "(11) 99999-9999",
      });
    } else {
      Alert.alert("Erro", "Cliente não encontrado.");
      setCliente(null);
    }
  };

  const redefinirSenha = () => {
    Alert.alert("Sucesso", "Senha redefinida com sucesso!");
  };

  const excluirCliente = () => {
    Alert.alert("Confirmação", "Tem certeza que deseja excluir este cliente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setCliente(null) },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gerenciar Clientes 👩‍⚖️</Text>

      <View style={styles.searchBox}>
        <Feather name="search" size={20} color="#555" />
        <TextInput
          placeholder="Digite o CPF do cliente"
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarCliente}>
          <Text style={styles.searchText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {cliente && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Cliente Encontrado:</Text>
          <Text style={styles.resultText}>📛 Nome: {cliente.nome}</Text>
          <Text style={styles.resultText}>✉️ E-mail: {cliente.email}</Text>
          <Text style={styles.resultText}>📞 Telefone: {cliente.telefone}</Text>

          <TouchableOpacity style={styles.actionButton} onPress={redefinirSenha}>
            <Text style={styles.actionText}>Redefinir Senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF5252" }]} onPress={excluirCliente}>
            <Text style={styles.actionText}>Excluir Cliente</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#E9F2FF" },
  title: { fontSize: 24, fontWeight: "bold", color: "#0052CC", marginBottom: 20, textAlign: "center" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 3,
    marginBottom: 20,
  },
  input: { flex: 1, height: 45, paddingHorizontal: 10, color: "#333" },
  searchButton: { backgroundColor: "#0052CC", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  searchText: { color: "#FFF", fontWeight: "bold" },
  resultBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  resultTitle: { fontSize: 18, fontWeight: "bold", color: "#0052CC", marginBottom: 10 },
  resultText: { fontSize: 15, color: "#333", marginBottom: 5 },
  actionButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  actionText: { color: "#FFF", fontWeight: "bold" },
});

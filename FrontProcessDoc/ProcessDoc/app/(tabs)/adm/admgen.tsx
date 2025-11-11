import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AdmGerenciarClientes() {
  const [cpf, setCpf] = useState("");
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: "Maria Oliveira",
      cpf: "111.111.111-11",
      email: "maria@teste.com",
      telefone: "(11) 99999-9999",
      status: "Ativo",
      dataCadastro: "12/03/2024",
    },
    {
      id: 2,
      nome: "João Silva",
      cpf: "222.222.222-22",
      email: "joao@teste.com",
      telefone: "(11) 98888-8888",
      status: "Inativo",
      dataCadastro: "05/07/2024",
    },
    {
      id: 3,
      nome: "Ana Souza",
      cpf: "333.333.333-33",
      email: "ana@teste.com",
      telefone: "(11) 97777-7777",
      status: "Ativo",
      dataCadastro: "20/09/2024",
    },
  ]);

  const [clienteFiltrado, setClienteFiltrado] = useState<any>(null);

  const buscarCliente = () => {
    if (cpf.trim() === "") {
      Alert.alert("Atenção", "Digite um CPF válido.");
      return;
    }
    const encontrado = clientes.find((c) => c.cpf === cpf);
    if (encontrado) {
      setClienteFiltrado(encontrado);
    } else {
      Alert.alert("Erro", "Cliente não encontrado.");
      setClienteFiltrado(null);
    }
  };

  const redefinirSenha = (nome: string) => {
    Alert.alert("Sucesso", `Senha de ${nome} redefinida com sucesso!`);
  };

  const excluirCliente = (id: number) => {
    Alert.alert("Confirmação", "Deseja realmente excluir este cliente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          setClientes((prev) => prev.filter((c) => c.id !== id));
          setClienteFiltrado(null);
          Alert.alert("Excluído", "Cliente removido com sucesso.");
        },
      },
    ]);
  };

  const editarCliente = (nome: string) => {
    Alert.alert("Função em desenvolvimento", `Editar cliente ${nome}.`);
  };

  const renderCliente = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardText}>CPF: {item.cpf}</Text>
      <Text style={styles.cardText}>E-mail: {item.email}</Text>
      <Text style={styles.cardText}>Telefone: {item.telefone}</Text>
      <Text
        style={[
          styles.cardStatus,
          { color: item.status === "Ativo" ? "#2E8B57" : "#D32F2F" },
        ]}
      >
        {item.status}
      </Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#007BFF" }]}
          onPress={() => editarCliente(item.nome)}
        >
          <Feather name="edit-3" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FFB300" }]}
          onPress={() => redefinirSenha(item.nome)}
        >
          <Feather name="lock" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#D32F2F" }]}
          onPress={() => excluirCliente(item.id)}
        >
          <Feather name="trash-2" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.voltar} onPress={() => router.push("/(tabs)/adm/adm")}>
        <Feather name="arrow-left" size={20} color="#0052CC" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Gerenciar Clientes</Text>
      <Text style={styles.subtitle}>
        Pesquise, edite ou remova clientes cadastrados.
      </Text>

      <View style={styles.searchBox}>
        <Feather name="search" size={20} color="#555" />
        <TextInput
          placeholder="Digite o CPF do cliente"
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarCliente}>
          <Feather name="arrow-right-circle" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {clienteFiltrado ? (
        <View style={{ marginTop: 20 }}>
          {renderCliente({ item: clienteFiltrado })}
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Clientes Cadastrados</Text>
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCliente}
            scrollEnabled={false}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#E9F2FF" },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 4,
  },
  voltarTexto: {
    color: "#0052CC",
    fontWeight: "600",
    fontSize: 15,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#0052CC", textAlign: "center" },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 3,
    marginBottom: 25,
  },
  input: { flex: 1, height: 45, paddingHorizontal: 10, color: "#333" },
  searchButton: {
    backgroundColor: "#0052CC",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0052CC",
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#0052CC" },
  cardText: { color: "#333", marginTop: 2 },
  cardStatus: { marginTop: 5, fontWeight: "bold" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
});

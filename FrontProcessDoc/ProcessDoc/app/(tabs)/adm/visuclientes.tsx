import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function VisuClientes() {
  const router = useRouter();

  const [filtroNome, setFiltroNome] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.clientes.listar();
      setClientes(response);
      setClientesFiltrados(response);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar clientes");
      setClientes([]);
      setClientesFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltro = (texto: string) => {
    setFiltroNome(texto);
    if (texto.trim() === "") {
      setClientesFiltrados(clientes);
    } else {
      const filtrado = clientes.filter((c) =>
        c.nomeCompleto.toLowerCase().includes(texto.toLowerCase())
      );
      setClientesFiltrados(filtrado);
    }
  };

  const excluirCliente = (cpf: string, nome: string) => {
    Alert.alert(
      "Excluir Cliente",
      `Tem certeza que deseja excluir o cliente ${nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.clientes.excluir(cpf);
              setClientes((prev) => prev.filter((c) => c.cpf !== cpf));
              setClientesFiltrados((prev) => prev.filter((c) => c.cpf !== cpf));
              Alert.alert("Sucesso", "Cliente removido com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Falha ao remover cliente");
            }
          },
        },
      ]
    );
  };

  const renderCliente = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="account" size={32} color="#1E40AF" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.nomeCompleto}</Text>
          <Text style={styles.info}>CPF: {item.cpf}</Text>
          <Text style={styles.info}>Tel: {item.telefone}</Text>
          {item.email && <Text style={styles.info}>Email: {item.email}</Text>}
          {item.endereco && <Text style={styles.info}>End: {item.endereco}</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => excluirCliente(item.cpf, item.nomeCompleto)}
      >
        <Feather name="trash-2" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.title}>Visualizar Clientes</Text>

          {/* Filtro */}
          <View style={styles.filtrosContainer}>
            <Text style={styles.label}>Buscar por Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do cliente"
              placeholderTextColor="#888"
              value={filtroNome}
              onChangeText={handleFiltro}
            />
          </View>

          {/* Lista de Clientes */}
          <View style={styles.clientesContainer}>
            <Text style={styles.sectionTitle}>
              Clientes Cadastrados ({clientesFiltrados.length})
            </Text>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Carregando...</Text>
              </View>
            ) : clientesFiltrados.length > 0 ? (
              <FlatList
                data={clientesFiltrados}
                keyExtractor={(item) => item.cpf}
                renderItem={renderCliente}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="account-multiple-outline"
                  size={48}
                  color="#888"
                />
                <Text style={styles.emptyStateText}>Nenhum cliente encontrado</Text>
                <Text style={styles.emptyStateSubtext}>
                  Comece cadastrando um novo cliente.
                </Text>
              </View>
            )}
          </View>

          {/* Botão para Cadastrar Novo */}
          <TouchableOpacity
            style={styles.novoButton}
            onPress={() => router.push("/(tabs)/adm/clientes")}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.novoButtonText}>Cadastrar Novo Cliente</Text>
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
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingVertical: 20 },
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
  title: { fontSize: 24, fontWeight: "bold", color: "#1E40AF", textAlign: "center", marginBottom: 20 },
  filtrosContainer: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
  label: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: 16,
  },
  clientesContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 15 },
  card: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1E40AF",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  name: { fontSize: 15, fontWeight: "bold", color: "#1E40AF" },
  info: { fontSize: 13, color: "#666", marginTop: 2 },
  deleteButton: {
    backgroundColor: "#D32F2F",
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  novoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  novoButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyStateText: { fontSize: 16, fontWeight: "600", color: "#666", marginTop: 10 },
  emptyStateSubtext: { fontSize: 14, color: "#888", textAlign: "center", marginTop: 5 },
});
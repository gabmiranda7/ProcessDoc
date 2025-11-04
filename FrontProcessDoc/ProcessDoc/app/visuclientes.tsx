import React, { useEffect, useState, useCallback } from "react";
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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskInput, { Masks } from "react-native-mask-input";
import { clientesApi } from "../api";

const { width } = Dimensions.get("window");

export default function PesquisarClientesScreen() {
  const router = useRouter();

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpf, setFiltroCpf] = useState("");
  const [filtroTelefone, setFiltroTelefone] = useState("");

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientesApi.listar();
      // assumindo que a API retorna um array de clientes
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      Alert.alert("Erro", "Não foi possível buscar os clientes. (Verifique o backend.)");
      setClientes([]); // fallback para vazio
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClientes();
    setRefreshing(false);
  };

  // filtro local (aplica sobre os dados retornados)
  const clientesFiltrados = clientes.filter((cliente) => {
    const nomeMatch =
      filtroNome === "" ||
      (cliente.nomeCompleto || cliente.nome || "").toLowerCase().includes(filtroNome.toLowerCase());
    const cpfMatch = filtroCpf === "" || (cliente.cpf || "").includes(filtroCpf);
    const telefoneMatch = filtroTelefone === "" || (cliente.telefone || "").includes(filtroTelefone);
    return nomeMatch && cpfMatch && telefoneMatch;
  });

  const handleVisualizarCliente = (cliente: any) => {
    // quando tiver rota de detalhe, use router.push(`/clientes/${cliente.id}`)
    Alert.alert("Visualizar Cliente", `Dados de: ${cliente.nomeCompleto || cliente.nome}`);
  };

  const handleEditarCliente = (cliente: any) => {
    // abrir tela de edição - por enquanto só alerta
    Alert.alert("Editar Cliente", `Editar: ${cliente.nomeCompleto || cliente.nome}`);
  };

  const handleExcluirCliente = async (cliente: any) => {
    Alert.alert(
      "Excluir Cliente",
      `Deseja excluir ${cliente.nomeCompleto || cliente.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await clientesApi.excluir(cliente.id);
              Alert.alert("Sucesso", "Cliente excluído");
              fetchClientes(); // refresh
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert("Erro", "Não foi possível excluir o cliente.");
            }
          },
        },
      ]
    );
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

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>Pesquisar Clientes</Text>

          <View style={styles.filtrosContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Cliente</Text>
              <View style={styles.rowInputWithButton}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do cliente"
                  placeholderTextColor="#888"
                  value={filtroNome}
                  onChangeText={setFiltroNome}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => { /* opcional */ }}>
                  <Feather name="search" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <MaskInput
                mask={Masks.BRL_CPF}
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={filtroCpf}
                onChangeText={setFiltroCpf}
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
                value={filtroTelefone}
                onChangeText={setFiltroTelefone}
              />
            </View>

            <TouchableOpacity style={styles.clearFiltersButton} onPress={() => { setFiltroNome(''); setFiltroCpf(''); setFiltroTelefone(''); }}>
              <Feather name="x" size={16} color="#FFFFFF" />
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clientesContainer}>
            <Text style={styles.sectionTitle}>Clientes Encontrados ({clientesFiltrados.length})</Text>

            {loading ? (
              <ActivityIndicator />
            ) : clientesFiltrados.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="account-search" size={48} color="#888" />
                <Text style={styles.emptyStateText}>Nenhum cliente encontrado</Text>
                <Text style={styles.emptyStateSubtext}>Puxe para atualizar ou cadastre novos clientes.</Text>
              </View>
            ) : (
              clientesFiltrados.map((cliente) => (
                <View key={cliente.id} style={styles.clienteCard}>
                  <View style={styles.clienteHeader}>
                    <View style={styles.clienteIconContainer}>
                      <MaterialCommunityIcons name="account" size={24} color="#007BFF" />
                    </View>
                    <View style={styles.clienteInfo}>
                      <Text style={styles.clienteNome}>{cliente.nomeCompleto}</Text>
                      <Text style={styles.clienteCpf}>CPF: {cliente.cpf}</Text>
                      <Text style={styles.clienteTelefone}>Tel: {cliente.telefone}</Text>
                      <Text style={styles.clienteEndereco}>{cliente.endereco}</Text>
                      {cliente.processo ? <Text style={styles.clienteProcesso}>Processo: {cliente.processo}</Text> : null}
                    </View>
                  </View>

                  <View style={styles.clienteActions}>
                    <TouchableOpacity style={[styles.actionButton, styles.visualizarButton]} onPress={() => handleVisualizarCliente(cliente)}>
                      <Feather name="eye" size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Ver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.editarButton]} onPress={() => handleEditarCliente(cliente)}>
                      <Feather name="edit" size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.excluirButton]} onPress={() => handleExcluirCliente(cliente)}>
                      <Feather name="trash-2" size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.novoClienteButton} onPress={() => router.push("/clientes")}>
            <Feather name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.novoClienteButtonText}>Cadastrar Novo Cliente</Text>
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
  filtrosContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  rowInputWithButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C757D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  clearFiltersText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  clientesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  clienteCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
  },
  clienteHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  clienteIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  clienteCpf: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  clienteTelefone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  clienteEndereco: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  clienteProcesso: {
    fontSize: 12,
    color: "#007BFF",
    fontWeight: "600",
  },
  clienteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: "center",
  },
  visualizarButton: {
    backgroundColor: "#007BFF",
  },
  editarButton: {
    backgroundColor: "#28A745",
  },
  excluirButton: {
    backgroundColor: "#DC3545",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  novoClienteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  novoClienteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
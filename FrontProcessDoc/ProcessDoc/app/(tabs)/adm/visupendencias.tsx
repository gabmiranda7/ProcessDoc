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

export default function VisualizarPendencias() {
  const router = useRouter();

  const [filtroCliente, setFiltroCliente] = useState("");
  const [pendencias, setPendencias] = useState<any[]>([]);
  const [pendenciasFiltradas, setPendenciasFiltradas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPendencias();
  }, []);

  const carregarPendencias = async () => {
    try {
      setLoading(true);
      // Quando a API estiver pronta, descomentar:
      // const response = await api.get('/pendencias');
      // setPendencias(response.data);
      // setPendenciasFiltradas(response.data);
      
      // Mock temporário
      setPendencias([]);
      setPendenciasFiltradas([]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar pendências");
      setPendencias([]);
      setPendenciasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltro = (texto: string) => {
    setFiltroCliente(texto);
    if (texto.trim() === "") {
      setPendenciasFiltradas(pendencias);
    } else {
      const filtrado = pendencias.filter((p) =>
        p.nomeCliente.toLowerCase().includes(texto.toLowerCase())
      );
      setPendenciasFiltradas(filtrado);
    }
  };

  const marcarComoResolvida = (id: string, descricao: string) => {
    Alert.alert(
      "Resolver Pendência",
      `Deseja marcar como resolvida: "${descricao}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Resolver",
          onPress: async () => {
            try {
              // Quando a API estiver pronta, descomentar:
              // await api.put(`/pendencias/${id}/resolver`);
              
              setPendencias((prev) => prev.filter((p) => p.id !== id));
              setPendenciasFiltradas((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("Sucesso", "Pendência resolvida com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Falha ao resolver pendência");
            }
          },
        },
      ]
    );
  };

  const excluirPendencia = (id: string, descricao: string) => {
    Alert.alert(
      "Excluir Pendência",
      `Tem certeza que deseja excluir: "${descricao}"?`,
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
              // Quando a API estiver pronta, descomentar:
              // await api.delete(`/pendencias/${id}`);
              
              setPendencias((prev) => prev.filter((p) => p.id !== id));
              setPendenciasFiltradas((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("Sucesso", "Pendência removida com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Falha ao remover pendência");
            }
          },
        },
      ]
    );
  };

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade?.toLowerCase()) {
      case "alta":
        return "#D32F2F";
      case "média":
      case "media":
        return "#F57C00";
      case "baixa":
        return "#388E3C";
      default:
        return "#666";
    }
  };

  const renderPendencia = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={24} 
            color={getPrioridadeCor(item.prioridade)} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.clienteName}>{item.nomeCliente}</Text>
            <View style={styles.prioridadeTag}>
              <Text 
                style={[
                  styles.prioridadeText, 
                  { color: getPrioridadeCor(item.prioridade) }
                ]}
              >
                {item.prioridade || "Média"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.descricao}>{item.descricao}</Text>
        {item.dataLimite && (
          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color="#666" />
            <Text style={styles.infoText}>
              Prazo: {new Date(item.dataLimite).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}
        {item.processo && (
          <View style={styles.infoRow}>
            <Feather name="briefcase" size={14} color="#666" />
            <Text style={styles.infoText}>Processo: {item.processo}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.resolverButton}
          onPress={() => marcarComoResolvida(item.id, item.descricao)}
        >
          <Feather name="check" size={18} color="#fff" />
          <Text style={styles.resolverButtonText}>Resolver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => excluirPendencia(item.id, item.descricao)}
        >
          <Feather name="trash-2" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
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
          <Text style={styles.title}>Visualizar Pendências</Text>

          {/* Filtro */}
          <View style={styles.filtrosContainer}>
            <Text style={styles.label}>Buscar por Cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do cliente"
              placeholderTextColor="#888"
              value={filtroCliente}
              onChangeText={handleFiltro}
            />
          </View>

          {/* Lista de Pendências */}
          <View style={styles.pendenciasContainer}>
            <Text style={styles.sectionTitle}>
              Pendências Cadastradas ({pendenciasFiltradas.length})
            </Text>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Carregando...</Text>
              </View>
            ) : pendenciasFiltradas.length > 0 ? (
              <FlatList
                data={pendenciasFiltradas}
                keyExtractor={(item) => item.id}
                renderItem={renderPendencia}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={48}
                  color="#388E3C"
                />
                <Text style={styles.emptyStateText}>Nenhuma pendência encontrada</Text>
                <Text style={styles.emptyStateSubtext}>
                  Todas as pendências estão resolvidas ou cadastre uma nova.
                </Text>
              </View>
            )}
          </View>

          {/* Botão para Cadastrar Nova */}
          <TouchableOpacity
            style={styles.novoButton}
            onPress={() => router.push("/(tabs)/adm/pendencias")}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.novoButtonText}>Cadastrar Nova Pendência</Text>
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
  scrollContainer: { 
    flexGrow: 1, 
    alignItems: "center", 
    paddingVertical: 20,
    paddingBottom: 100,
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
    marginBottom: 20 
  },
  filtrosContainer: { 
    marginBottom: 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#E0E0E0" 
  },
  label: { 
    fontSize: 14, 
    color: "#333", 
    marginBottom: 5, 
    fontWeight: "500" 
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
  pendenciasContainer: { marginBottom: 20 },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 15 
  },
  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1E40AF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerInfo: {
    flex: 1,
  },
  clienteName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#1E40AF",
    marginBottom: 4,
  },
  prioridadeTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  prioridadeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    marginBottom: 12,
  },
  descricao: { 
    fontSize: 14, 
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  infoText: { 
    fontSize: 13, 
    color: "#666",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  resolverButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#388E3C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 6,
  },
  resolverButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  novoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  novoButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
    marginLeft: 8 
  },
  emptyState: { 
    alignItems: "center", 
    paddingVertical: 40 
  },
  emptyStateText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#666", 
    marginTop: 10 
  },
  emptyStateSubtext: { 
    fontSize: 14, 
    color: "#888", 
    textAlign: "center", 
    marginTop: 5 
  },
});
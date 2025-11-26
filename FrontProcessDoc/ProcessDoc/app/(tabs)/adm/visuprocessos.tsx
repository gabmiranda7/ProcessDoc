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

export default function ProcessosVisualizar() {
  const router = useRouter();

  const [filtroNumero, setFiltroNumero] = useState("");
  const [processos, setProcessos] = useState<any[]>([]);
  const [processosFiltrados, setProcessosFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProcessos();
  }, []);

  const carregarProcessos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/processos');
      setProcessos(response.data);
      setProcessosFiltrados(response.data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar processos");
      setProcessos([]);
      setProcessosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltro = (texto: string) => {
    setFiltroNumero(texto);
    if (texto.trim() === "") {
      setProcessosFiltrados(processos);
    } else {
      const filtrado = processos.filter(
        (p) =>
          p.numero.toLowerCase().includes(texto.toLowerCase()) ||
          p.cliente.toLowerCase().includes(texto.toLowerCase()) ||
          p.tribunal.toLowerCase().includes(texto.toLowerCase())
      );
      setProcessosFiltrados(filtrado);
    }
  };

  const handleVerDetalhes = (processo: any) => {
    Alert.alert(
      "Detalhes do Processo",
      `Número: ${processo.numero}\n` +
      `Tribunal: ${processo.tribunal}\n` +
      `Vara: ${processo.vara}\n` +
      `Natureza: ${processo.natureza}\n` +
      `Cliente: ${processo.cliente}\n` +
      (processo.observacoes ? `\nObservações: ${processo.observacoes}` : ""),
      [{ text: "OK" }]
    );
  };

  const excluirProcesso = (id: string, numero: string) => {
    Alert.alert(
      "Excluir Processo",
      `Tem certeza que deseja excluir o processo ${numero}?`,
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
              await api.delete(`/processos/${id}`);
              setProcessos((prev) => prev.filter((p) => p.id !== id));
              setProcessosFiltrados((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("Sucesso", "Processo removido com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.response?.data?.message || "Falha ao remover processo");
            }
          },
        },
      ]
    );
  };

  const getStatusCor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "em andamento":
        return "#2563EB";
      case "suspenso":
        return "#F59E0B";
      case "arquivado":
        return "#6B7280";
      case "concluído":
      case "concluido":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const renderProcesso = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="folder-open"
            size={24}
            color="#1E40AF"
          />
          <View style={styles.headerInfo}>
            <Text style={styles.numeroProcesso}>{item.numero}</Text>
            <Text style={styles.tribunalText}>{item.tribunal}</Text>
          </View>
        </View>
        {item.status && (
          <View
            style={[
              styles.statusTag,
              { backgroundColor: getStatusCor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusCor(item.status) },
              ]}
            >
              {item.status}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Feather name="user" size={14} color="#666" />
          <Text style={styles.infoText}>Cliente: {item.cliente}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="briefcase" size={14} color="#666" />
          <Text style={styles.infoText}>Natureza: {item.natureza}</Text>
        </View>
        {item.vara && (
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={14} color="#666" />
            <Text style={styles.infoText}>Vara: {item.vara}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.verButton}
          onPress={() => handleVerDetalhes(item)}
        >
          <Feather name="eye" size={18} color="#fff" />
          <Text style={styles.verButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => excluirProcesso(item.id, item.numero)}
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
          <Text style={styles.title}>Visualizar Processos</Text>

          {/* Filtro */}
          <View style={styles.filtrosContainer}>
            <Text style={styles.label}>Buscar Processo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o número, cliente ou tribunal"
              placeholderTextColor="#888"
              value={filtroNumero}
              onChangeText={handleFiltro}
            />
          </View>

          {/* Lista de Processos */}
          <View style={styles.processosContainer}>
            <Text style={styles.sectionTitle}>
              Processos Cadastrados ({processosFiltrados.length})
            </Text>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Carregando...</Text>
              </View>
            ) : processosFiltrados.length > 0 ? (
              <FlatList
                data={processosFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={renderProcesso}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="folder-open-outline"
                  size={48}
                  color="#888"
                />
                <Text style={styles.emptyStateText}>
                  Nenhum processo encontrado
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Comece cadastrando um novo processo.
                </Text>
              </View>
            )}
          </View>

          {/* Botão para Cadastrar Novo */}
          <TouchableOpacity
            style={styles.novoButton}
            onPress={() => router.push("/(tabs)/adm/processos")}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.novoButtonText}>Cadastrar Novo Processo</Text>
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
    marginBottom: 20,
  },
  filtrosContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  processosContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
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
    marginBottom: 12,
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
  numeroProcesso: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 2,
  },
  tribunalText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
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
  verButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 6,
  },
  verButtonText: {
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
    marginLeft: 8,
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
});
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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function VisualizarDocs() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState<any[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);

  const tipos = ["Todos", "CPF", "Certidão", "Identidade", "Endereço", "Intimação"];

  const icones: { [key: string]: any } = {
    CPF: "card-account-details",
    Certidão: "file-document",
    Identidade: "account-box",
    Endereço: "home-city",
    Intimação: "alert",
    Todos: "check-all",
  };

  const cores: { [key: string]: string } = {
    CPF: "#3B82F6",
    Certidão: "#8B5CF6",
    Identidade: "#F59E0B",
    Endereço: "#10B981",
    Intimação: "#EF4444",
  };

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documentos/meus');
      setDocumentos(response.data);
      setDocumentosFiltrados(response.data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar documentos");
      setDocumentos([]);
      setDocumentosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (nome: string, tipo: string) => {
    let filtrados = [...documentos];

    // Filtro por nome
    if (nome.trim()) {
      filtrados = filtrados.filter((doc) =>
        doc.nome?.toLowerCase().includes(nome.toLowerCase()) ||
        doc.nomeDocumento?.toLowerCase().includes(nome.toLowerCase())
      );
    }

    // Filtro por tipo
    if (tipo && tipo !== "Todos") {
      filtrados = filtrados.filter((doc) => doc.tipo === tipo || doc.tipoDocumento === tipo);
    }

    setDocumentosFiltrados(filtrados);
  };

  const handleFiltroNome = (texto: string) => {
    setFiltroNome(texto);
    aplicarFiltros(texto, filtroTipo);
  };

  const handleFiltroTipo = (tipo: string) => {
    setFiltroTipo(tipo);
    setModalFiltroVisible(false);
    aplicarFiltros(filtroNome, tipo);
  };

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroTipo("");
    setDocumentosFiltrados(documentos);
  };

  const visualizarDocumento = (documento: any) => {
    Alert.alert(
      documento.nome || documento.nomeDocumento,
      `Tipo: ${documento.tipo || documento.tipoDocumento}\n` +
      (documento.numeroProcesso ? `Processo: ${documento.numeroProcesso}\n` : '') +
      (documento.dataUpload ? `Upload em: ${new Date(documento.dataUpload).toLocaleDateString('pt-BR')}\n` : '') +
      (documento.observacoes ? `\nObservações: ${documento.observacoes}` : ''),
      [
        { text: "Fechar" },
        {
          text: "Baixar",
          onPress: () => baixarDocumento(documento),
        },
      ]
    );
  };

  const baixarDocumento = (documento: any) => {
    Alert.alert(
      "Download",
      "Funcionalidade de download em desenvolvimento. Em breve você poderá baixar seus documentos!",
      [{ text: "OK" }]
    );
  };

  const formatarData = (data: string) => {
    if (!data) return "Data não informada";
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const renderDocumento = ({ item }: any) => {
    const tipo = item.tipo || item.tipoDocumento || "Documento";
    const cor = cores[tipo] || "#6B7280";

    return (
      <TouchableOpacity
        style={styles.documentoCard}
        onPress={() => visualizarDocumento(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: cor + "15" }]}>
          <MaterialCommunityIcons
            name={icones[tipo] || "file-document"}
            size={28}
            color={cor}
          />
        </View>

        <View style={styles.documentoInfo}>
          <Text style={styles.documentoNome} numberOfLines={1}>
            {item.nome || item.nomeDocumento}
          </Text>
          <View style={styles.documentoMeta}>
            <View style={[styles.tipoTag, { backgroundColor: cor + "15" }]}>
              <Text style={[styles.tipoText, { color: cor }]}>{tipo}</Text>
            </View>
            {item.dataUpload && (
              <Text style={styles.documentoData}>
                {formatarData(item.dataUpload)}
              </Text>
            )}
          </View>
          {item.numeroProcesso && (
            <View style={styles.processoContainer}>
              <Feather name="briefcase" size={12} color="#666" />
              <Text style={styles.processoText} numberOfLines={1}>
                {item.numeroProcesso}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => baixarDocumento(item)}
        >
          <Feather name="download" size={20} color="#1E40AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cliente/inicio")}
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

      {/* Modal de Filtro por Tipo */}
      <Modal
        visible={modalFiltroVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalFiltroVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalFiltroVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Tipo</Text>
              <TouchableOpacity onPress={() => setModalFiltroVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {tipos.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={styles.modalItem}
                  onPress={() => handleFiltroTipo(tipo)}
                >
                  <MaterialCommunityIcons
                    name={icones[tipo]}
                    size={20}
                    color={cores[tipo] || "#1E40AF"}
                  />
                  <Text style={styles.modalItemText}>{tipo}</Text>
                  {filtroTipo === tipo && (
                    <Feather name="check" size={20} color="#1E40AF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="folder-multiple" size={32} color="#1E40AF" />
            <Text style={styles.title}>Meus Documentos</Text>
          </View>
          <Text style={styles.subtitle}>
            Visualize e baixe seus documentos
          </Text>

          {/* Filtros */}
          <View style={styles.filtrosContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Buscar por nome</Text>
              <View style={styles.searchContainer}>
                <Feather name="search" size={18} color="#888" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Digite o nome do documento"
                  placeholderTextColor="#888"
                  value={filtroNome}
                  onChangeText={handleFiltroNome}
                />
                {filtroNome.length > 0 && (
                  <TouchableOpacity onPress={() => handleFiltroNome("")}>
                    <Feather name="x" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.filtroRow}>
              <TouchableOpacity
                style={styles.filtroButton}
                onPress={() => setModalFiltroVisible(true)}
              >
                <Feather name="filter" size={18} color="#1E40AF" />
                <Text style={styles.filtroButtonText}>
                  {filtroTipo || "Filtrar por tipo"}
                </Text>
              </TouchableOpacity>

              {(filtroNome || filtroTipo) && (
                <TouchableOpacity
                  style={styles.limparButton}
                  onPress={limparFiltros}
                >
                  <Feather name="x-circle" size={18} color="#666" />
                  <Text style={styles.limparButtonText}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista de Documentos */}
          <View style={styles.documentosContainer}>
            <View style={styles.contadorContainer}>
              <Text style={styles.contadorText}>
                {documentosFiltrados.length} documento(s) encontrado(s)
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={carregarDocumentos}
              >
                <Feather name="refresh-cw" size={18} color="#1E40AF" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons
                  name="loading"
                  size={48}
                  color="#1E40AF"
                />
                <Text style={styles.loadingText}>Carregando documentos...</Text>
              </View>
            ) : documentosFiltrados.length > 0 ? (
              <FlatList
                data={documentosFiltrados}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderDocumento}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="folder-open-outline"
                  size={64}
                  color="#888"
                />
                <Text style={styles.emptyStateText}>
                  {filtroNome || filtroTipo
                    ? "Nenhum documento encontrado"
                    : "Você ainda não possui documentos"}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {filtroNome || filtroTipo
                    ? "Tente ajustar os filtros de busca"
                    : "Os documentos enviados aparecerão aqui"}
                </Text>
              </View>
            )}
          </View>

          {/* Botão Cadastrar Novo */}
          <TouchableOpacity
            style={styles.novoButton}
            onPress={() => router.push("/(tabs)/cliente/enviardocs")}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.novoButtonText}>Enviar Novo Documento</Text>
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  filtrosContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filtroRow: {
    flexDirection: "row",
    gap: 8,
  },
  filtroButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#1E40AF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  filtroButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },
  limparButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  limparButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  documentosContainer: {
    marginBottom: 20,
  },
  contadorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  contadorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  refreshButton: {
    padding: 4,
  },
  listContent: {
    gap: 12,
  },
  documentoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  documentoInfo: {
    flex: 1,
  },
  documentoNome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  documentoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  tipoTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tipoText: {
    fontSize: 11,
    fontWeight: "600",
  },
  documentoData: {
    fontSize: 12,
    color: "#6B7280",
  },
  processoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  processoText: {
    fontSize: 12,
    color: "#6B7280",
  },
  downloadButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    width: width * 0.85,
    maxWidth: 400,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  modalScroll: {
    maxHeight: 350,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
  novoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  novoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
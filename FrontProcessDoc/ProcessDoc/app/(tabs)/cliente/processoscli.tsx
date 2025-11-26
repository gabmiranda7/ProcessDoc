import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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

export default function ProcessosCli() {
  const router = useRouter();

  const [processos, setProcessos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMeusProcessos();
  }, []);

  const carregarMeusProcessos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/processos/meus');
      setProcessos(response.data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar seus processos");
      setProcessos([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "em andamento":
        return { cor: "#2563EB", icone: "clock", texto: "Em Andamento" };
      case "aguardando documentos":
        return { cor: "#F59E0B", icone: "alert-circle", texto: "Aguardando Documentos" };
      case "em análise":
      case "em analise":
        return { cor: "#8B5CF6", icone: "search", texto: "Em Análise" };
      case "suspenso":
        return { cor: "#EF4444", icone: "pause-circle", texto: "Suspenso" };
      case "aguardando julgamento":
        return { cor: "#F97316", icone: "calendar", texto: "Aguardando Julgamento" };
      case "concluído":
      case "concluido":
        return { cor: "#10B981", icone: "check-circle", texto: "Concluído" };
      case "arquivado":
        return { cor: "#6B7280", icone: "archive", texto: "Arquivado" };
      default:
        return { cor: "#6B7280", icone: "file-text", texto: status || "Sem Status" };
    }
  };

  const calcularProgresso = (status: string) => {
    switch (status?.toLowerCase()) {
      case "aguardando documentos":
        return 15;
      case "em análise":
      case "em analise":
        return 30;
      case "em andamento":
        return 50;
      case "aguardando julgamento":
        return 70;
      case "concluído":
      case "concluido":
        return 100;
      case "arquivado":
        return 100;
      case "suspenso":
        return 40;
      default:
        return 0;
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "Sem data";
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const verDetalhes = (processo: any) => {
    const statusInfo = getStatusInfo(processo.status);
    const detalhes = `
📋 Número: ${processo.numero}

🏛️ Tribunal: ${processo.tribunal}

📍 Vara: ${processo.vara || "Não informada"}

📄 Natureza: ${processo.natureza}

⚖️ Status: ${statusInfo.texto}

📅 Última Atualização: ${formatarData(processo.ultimaAtualizacao || processo.updatedAt)}

${processo.proximoPasso ? `\n🎯 Próximo Passo:\n${processo.proximoPasso}` : ''}

${processo.observacoes ? `\n📝 Observações:\n${processo.observacoes}` : ''}
    `.trim();

    Alert.alert("Detalhes do Processo", detalhes, [{ text: "OK" }]);
  };

  const renderProcesso = ({ item }: any) => {
    const statusInfo = getStatusInfo(item.status);
    const progresso = calcularProgresso(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="folder-open"
            size={28}
            color="#1E40AF"
          />
          <View style={styles.headerInfo}>
            <Text style={styles.numeroProcesso}>{item.numero}</Text>
            <Text style={styles.tribunalText}>{item.tribunal}</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusInfo.cor + "15", borderColor: statusInfo.cor },
          ]}
        >
          <Feather name={statusInfo.icone as any} size={16} color={statusInfo.cor} />
          <Text style={[styles.statusText, { color: statusInfo.cor }]}>
            {statusInfo.texto}
          </Text>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressoContainer}>
          <View style={styles.progressoHeader}>
            <Text style={styles.progressoLabel}>Andamento do Processo</Text>
            <Text style={styles.progressoPercentual}>{progresso}%</Text>
          </View>
          <View style={styles.progressoBarra}>
            <View
              style={[
                styles.progressoPreenchido,
                { width: `${progresso}%`, backgroundColor: statusInfo.cor },
              ]}
            />
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.infoContainer}>
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
          {item.ultimaAtualizacao || item.updatedAt ? (
            <View style={styles.infoRow}>
              <Feather name="calendar" size={14} color="#666" />
              <Text style={styles.infoText}>
                Última atualização: {formatarData(item.ultimaAtualizacao || item.updatedAt)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Próximo Passo */}
        {item.proximoPasso && (
          <View style={styles.proximoPassoContainer}>
            <View style={styles.proximoPassoHeader}>
              <Feather name="arrow-right-circle" size={16} color="#1E40AF" />
              <Text style={styles.proximoPassoTitulo}>Próximo Passo</Text>
            </View>
            <Text style={styles.proximoPassoTexto}>{item.proximoPasso}</Text>
          </View>
        )}

        {/* Botão Ver Detalhes */}
        <TouchableOpacity
          style={styles.detalhesButton}
          onPress={() => verDetalhes(item)}
        >
          <Feather name="info" size={18} color="#1E40AF" />
          <Text style={styles.detalhesButtonText}>Ver Detalhes Completos</Text>
        </TouchableOpacity>
      </View>
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="file-document-multiple" size={32} color="#1E40AF" />
            <Text style={styles.title}>Meus Processos</Text>
          </View>
          <Text style={styles.subtitle}>
            Acompanhe o andamento dos seus processos em tempo real
          </Text>

          {/* Lista de Processos */}
          <View style={styles.processosContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons
                  name="loading"
                  size={48}
                  color="#1E40AF"
                />
                <Text style={styles.loadingText}>Carregando processos...</Text>
              </View>
            ) : processos.length > 0 ? (
              <>
                <View style={styles.contadorContainer}>
                  <Text style={styles.contadorTexto}>
                    Você possui {processos.length} processo(s) em acompanhamento
                  </Text>
                </View>
                <FlatList
                  data={processos}
                  keyExtractor={(item) => item.id}
                  renderItem={renderProcesso}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                />
              </>
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="folder-open-outline"
                  size={64}
                  color="#888"
                />
                <Text style={styles.emptyStateText}>
                  Nenhum processo encontrado
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Você ainda não possui processos cadastrados em seu nome.
                </Text>
              </View>
            )}
          </View>

          {/* Botão Atualizar */}
          <TouchableOpacity
            style={styles.atualizarButton}
            onPress={carregarMeusProcessos}
            disabled={loading}
          >
            <Feather name="refresh-cw" size={20} color="#fff" />
            <Text style={styles.atualizarButtonText}>
              {loading ? "Atualizando..." : "Atualizar Processos"}
            </Text>
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
  processosContainer: {
    marginBottom: 20,
  },
  contadorContainer: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#1E40AF",
  },
  contadorTexto: {
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "600",
  },
  listContent: {
    gap: 15,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  numeroProcesso: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 2,
  },
  tribunalText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressoContainer: {
    marginBottom: 16,
  },
  progressoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  progressoPercentual: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  progressoBarra: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressoPreenchido: {
    height: "100%",
    borderRadius: 4,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  proximoPassoContainer: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  proximoPassoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  proximoPassoTitulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#92400E",
  },
  proximoPassoTexto: {
    fontSize: 13,
    color: "#78350F",
    lineHeight: 18,
  },
  detalhesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#1E40AF",
    backgroundColor: "#FFFFFF",
  },
  detalhesButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
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
    paddingHorizontal: 20,
  },
  atualizarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  atualizarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
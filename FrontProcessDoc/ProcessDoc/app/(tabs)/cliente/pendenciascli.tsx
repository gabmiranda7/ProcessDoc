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
  TextInput,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function PendenciasCli() {
  const router = useRouter();

  const [pendencias, setPendencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [respostaTexto, setRespostaTexto] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    carregarMinhasPendencias();
  }, []);

  const carregarMinhasPendencias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pendencias/minhas');
      setPendencias(response.data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar suas pendências");
      setPendencias([]);
    } finally {
      setLoading(false);
    }
  };

  const getPrioridadeInfo = (prioridade: string) => {
    switch (prioridade?.toLowerCase()) {
      case "alta":
        return { cor: "#DC2626", icone: "alert-octagon", texto: "Alta Prioridade" };
      case "média":
      case "media":
        return { cor: "#F59E0B", icone: "alert-triangle", texto: "Média Prioridade" };
      case "baixa":
        return { cor: "#059669", icone: "alert-circle", texto: "Baixa Prioridade" };
      default:
        return { cor: "#6B7280", icone: "alert-circle", texto: "Normal" };
    }
  };

  const calcularDiasRestantes = (dataLimite: string) => {
    if (!dataLimite) return null;
    
    try {
      const hoje = new Date();
      const limite = new Date(dataLimite);
      const diff = Math.ceil((limite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff < 0) return { dias: Math.abs(diff), atrasado: true };
      return { dias: diff, atrasado: false };
    } catch {
      return null;
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "Sem prazo";
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const marcarComoRespondida = async (pendenciaId: string) => {
    const resposta = respostaTexto[pendenciaId]?.trim();
    
    if (!resposta) {
      Alert.alert("Atenção", "Digite uma resposta antes de enviar.");
      return;
    }

    Alert.alert(
      "Confirmar Resposta",
      "Deseja enviar esta resposta para o advogado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            try {
              await api.put(`/pendencias/${pendenciaId}/responder`, {
                resposta,
                dataResposta: new Date().toISOString(),
              });
              
              // Remove a pendência da lista após responder
              setPendencias((prev) => prev.filter((p) => p.id !== pendenciaId));
              
              // Limpa o texto da resposta
              setRespostaTexto((prev) => {
                const novo = { ...prev };
                delete novo[pendenciaId];
                return novo;
              });
              
              Alert.alert("Sucesso", "Resposta enviada com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.response?.data?.message || "Falha ao enviar resposta");
            }
          },
        },
      ]
    );
  };

  const handleRespostaChange = (pendenciaId: string, texto: string) => {
    setRespostaTexto((prev) => ({
      ...prev,
      [pendenciaId]: texto,
    }));
  };

  const renderPendencia = ({ item }: any) => {
    const prioridadeInfo = getPrioridadeInfo(item.prioridade);
    const prazo = calcularDiasRestantes(item.dataLimite);

    return (
      <View style={styles.card}>
        {/* Header com Prioridade */}
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.prioridadeBadge,
              { backgroundColor: prioridadeInfo.cor + "15", borderColor: prioridadeInfo.cor },
            ]}
          >
            <Feather name={prioridadeInfo.icone as any} size={16} color={prioridadeInfo.cor} />
            <Text style={[styles.prioridadeText, { color: prioridadeInfo.cor }]}>
              {prioridadeInfo.texto}
            </Text>
          </View>
        </View>

        {/* Descrição da Pendência */}
        <View style={styles.descricaoContainer}>
          <View style={styles.descricaoHeader}>
            <MaterialCommunityIcons name="clipboard-text" size={20} color="#1E40AF" />
            <Text style={styles.descricaoLabel}>O que preciso fazer?</Text>
          </View>
          <Text style={styles.descricaoTexto}>{item.descricao}</Text>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.infoContainer}>
          {item.dataLimite && (
            <View style={styles.infoRow}>
              <Feather name="calendar" size={16} color="#666" />
              <Text style={styles.infoText}>
                Prazo: {formatarData(item.dataLimite)}
              </Text>
              {prazo && (
                <View
                  style={[
                    styles.prazoChip,
                    { backgroundColor: prazo.atrasado ? "#FEE2E2" : "#DBEAFE" },
                  ]}
                >
                  <Text
                    style={[
                      styles.prazoTexto,
                      { color: prazo.atrasado ? "#DC2626" : "#1E40AF" },
                    ]}
                  >
                    {prazo.atrasado
                      ? `${prazo.dias} dia(s) atrasado`
                      : `${prazo.dias} dia(s) restante(s)`}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {item.processo && (
            <View style={styles.infoRow}>
              <Feather name="folder" size={16} color="#666" />
              <Text style={styles.infoText}>Processo: {item.processo}</Text>
            </View>
          )}

          {item.dataCriacao && (
            <View style={styles.infoRow}>
              <Feather name="clock" size={16} color="#666" />
              <Text style={styles.infoText}>
                Solicitado em: {formatarData(item.dataCriacao)}
              </Text>
            </View>
          )}
        </View>

        {/* Área de Resposta */}
        <View style={styles.respostaContainer}>
          <Text style={styles.respostaLabel}>Sua Resposta:</Text>
          <TextInput
            style={styles.respostaInput}
            placeholder="Digite aqui sua resposta ou informações solicitadas..."
            placeholderTextColor="#999"
            value={respostaTexto[item.id] || ""}
            onChangeText={(texto) => handleRespostaChange(item.id, texto)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botão de Enviar Resposta */}
        <TouchableOpacity
          style={styles.enviarButton}
          onPress={() => marcarComoRespondida(item.id)}
        >
          <Feather name="send" size={18} color="#fff" />
          <Text style={styles.enviarButtonText}>Enviar Resposta</Text>
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
            <MaterialCommunityIcons name="clipboard-check" size={32} color="#1E40AF" />
            <Text style={styles.title}>Minhas Pendências</Text>
          </View>
          <Text style={styles.subtitle}>
            Responda às solicitações do seu advogado
          </Text>

          {/* Estatísticas Rápidas */}
          {!loading && pendencias.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{pendencias.length}</Text>
                <Text style={styles.statLabel}>Pendente(s)</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: "#DC2626" }]}>
                  {pendencias.filter(p => {
                    const prazo = calcularDiasRestantes(p.dataLimite);
                    return prazo?.atrasado;
                  }).length}
                </Text>
                <Text style={styles.statLabel}>Atrasada(s)</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: "#DC2626" }]}>
                  {pendencias.filter(p => p.prioridade?.toLowerCase() === 'alta').length}
                </Text>
                <Text style={styles.statLabel}>Urgente(s)</Text>
              </View>
            </View>
          )}

          {/* Lista de Pendências */}
          <View style={styles.pendenciasContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons
                  name="loading"
                  size={48}
                  color="#1E40AF"
                />
                <Text style={styles.loadingText}>Carregando pendências...</Text>
              </View>
            ) : pendencias.length > 0 ? (
              <FlatList
                data={pendencias}
                keyExtractor={(item) => item.id}
                renderItem={renderPendencia}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={64}
                  color="#10B981"
                />
                <Text style={styles.emptyStateText}>
                  Nenhuma pendência no momento!
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Você está em dia com todas as solicitações. 🎉
                </Text>
              </View>
            )}
          </View>

          {/* Botão Atualizar */}
          <TouchableOpacity
            style={styles.atualizarButton}
            onPress={carregarMinhasPendencias}
            disabled={loading}
          >
            <Feather name="refresh-cw" size={20} color="#1E40AF" />
            <Text style={styles.atualizarButtonText}>
              {loading ? "Atualizando..." : "Atualizar Pendências"}
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
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  pendenciasContainer: {
    marginBottom: 20,
  },
  listContent: {
    gap: 16,
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
    marginBottom: 16,
  },
  prioridadeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    alignSelf: "flex-start",
  },
  prioridadeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  descricaoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#1E40AF",
  },
  descricaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  descricaoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E40AF",
  },
  descricaoTexto: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  infoContainer: {
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  prazoChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 4,
  },
  prazoTexto: {
    fontSize: 11,
    fontWeight: "600",
  },
  respostaContainer: {
    marginBottom: 14,
  },
  respostaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  respostaInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#374151",
    minHeight: 100,
    textAlignVertical: "top",
  },
  enviarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  enviarButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
    color: "#10B981",
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
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#1E40AF",
  },
  atualizarButtonText: {
    color: "#1E40AF",
    fontSize: 16,
    fontWeight: "700",
  },
});
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Pendencia {
  id: string;
  tipoDocumento: string;
  cliente: string;
  processoAssociado?: string;
  statusCobranca: string;
  prioridade: string;
  dataCadastro: string;
  dataLimite: { dia: string; mes: string; ano: string };
}

interface Props {
  pendencias: Pendencia[];
}

export default function VisualizarPendenciasScreen({ pendencias }: Props) {
  const router = useRouter();

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [dropdownTipoOpen, setDropdownTipoOpen] = useState(false);
  const [dropdownStatusOpen, setDropdownStatusOpen] = useState(false);
  const [dropdownPrioridadeOpen, setDropdownPrioridadeOpen] = useState(false);

  const tiposDocumento = ["Todos", "CPF", "RG", "Certidão de Nascimento", "Comprovante de Residência", "Procuração"];
  const statusCobrancas = ["Todos", "Aguardando Cliente", "Solicitado", "Em Cobrança", "Urgente", "Vencido"];
  const prioridades = ["Todas", "Baixa", "Média", "Alta", "Urgente"];

  const icones: { [key: string]: React.ComponentProps<typeof MaterialCommunityIcons>["name"] } = {
    "CPF": "card-account-details-outline",
    "RG": "card-account-details",
    "Certidão de Nascimento": "certificate-outline",
    "Comprovante de Residência": "home-outline",
    "Procuração": "file-document-outline",
  };

  const coresStatus: { [key: string]: string } = {
    "Aguardando Cliente": "#6C757D",
    "Solicitado": "#007BFF",
    "Em Cobrança": "#FFC107",
    "Urgente": "#FF6B35",
    "Vencido": "#DC3545",
  };

  const coresPrioridade: { [key: string]: string } = {
    "Baixa": "#28A745",
    "Média": "#FFC107",
    "Alta": "#FF6B35",
    "Urgente": "#DC3545",
  };

  const pendenciasFiltradas = pendencias.filter(pendencia => {
    const filtroTipoMatch = filtroTipo === "" || filtroTipo === "Todos" || pendencia.tipoDocumento === filtroTipo;
    const filtroClienteMatch = filtroCliente === "" || pendencia.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
    const filtroStatusMatch = filtroStatus === "" || filtroStatus === "Todos" || pendencia.statusCobranca === filtroStatus;
    const filtroPrioridadeMatch = filtroPrioridade === "" || filtroPrioridade === "Todas" || pendencia.prioridade === filtroPrioridade;
    return filtroTipoMatch && filtroClienteMatch && filtroStatusMatch && filtroPrioridadeMatch;
  });

  const handleVisualizarPendencia = (pendencia: Pendencia) => {
    Alert.alert(
      "Detalhes da Pendência",
      `Documento: ${pendencia.tipoDocumento}\nCliente: ${pendencia.cliente}\nPrazo: ${pendencia.dataLimite.dia}/${pendencia.dataLimite.mes}/${pendencia.dataLimite.ano}\nStatus: ${pendencia.statusCobranca}\nPrioridade: ${pendencia.prioridade}${pendencia.processoAssociado ? `\nProcesso: ${pendencia.processoAssociado}` : ''}`,
      [{ text: "Fechar", style: "cancel" }]
    );
  };

  const limparFiltros = () => {
    setFiltroTipo("");
    setFiltroCliente("");
    setFiltroStatus("");
    setFiltroPrioridade("");
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#007BFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image source={require("../assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Process Doc</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Pendências de Documentos</Text>

          {/* Filtros */}
          <View style={[styles.filtrosContainer, { zIndex: 10 }]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Buscar por Cliente</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do cliente"
                placeholderTextColor="#888"
                value={filtroCliente}
                onChangeText={setFiltroCliente}
              />
            </View>

            <View style={[styles.inputGroup, { zIndex: dropdownTipoOpen ? 9999 : 1 }]}>
              <Text style={styles.label}>Filtrar por Tipo</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownTipoOpen(!dropdownTipoOpen)}
              >
                <Text style={{ color: filtroTipo ? "#333" : "#888" }}>
                  {filtroTipo || "Todos os tipos"}
                </Text>
                <Feather name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {dropdownTipoOpen && (
                <View style={styles.dropdownList}>
                  {tiposDocumento.map(tipo => (
                    <TouchableOpacity
                      key={tipo}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFiltroTipo(tipo === "Todos" ? "" : tipo);
                        setDropdownTipoOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{tipo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.clearFiltersButton} onPress={limparFiltros}>
              <Feather name="x" size={16} color="#FFFFFF" />
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Pendências */}
          <View style={styles.pendenciasContainer}>
            <Text style={styles.sectionTitle}>
              Documentos Pendentes ({pendenciasFiltradas.length})
            </Text>

            {pendenciasFiltradas.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#888" }}>Nenhuma pendência encontrada</Text>
            ) : (
              pendenciasFiltradas.map(p => (
                <View key={p.id} style={styles.pendenciaCard}>
                  <View style={styles.pendenciaHeader}>
                    <MaterialCommunityIcons
                      name={icones[p.tipoDocumento] || "file-document-outline"}
                      size={24}
                      color="#007BFF"
                    />
                    <View style={{ marginLeft: 12 }}>
                      <Text>{p.tipoDocumento}</Text>
                      <Text>Cliente: {p.cliente}</Text>
                      <Text>Prazo: {p.dataLimite.dia}/{p.dataLimite.mes}/{p.dataLimite.ano}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleVisualizarPendencia(p)}
                    style={{ marginTop: 10, backgroundColor: "#007BFF", padding: 8, borderRadius: 6 }}
                  >
                    <Text style={{ color: "#fff" }}>Ver</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: "#E0F2F7" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#FFF" },
  backButton: { paddingRight: 10 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "center" },
  headerLogo: { width: 30, height: 30, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingVertical: 20 },
  formCard: { width: width * 0.9, backgroundColor: "#FFF", borderRadius: 15, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#007BFF", textAlign: "center", marginBottom: 20 },
  filtrosContainer: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
  inputGroup: { marginBottom: 15, position: "relative" },
  label: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8, color: "#333", fontSize: 16 },
  dropdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8 },
  dropdownList: { position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, marginTop: 2 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  dropdownItemText: { color: "#333", fontSize: 16 },
  clearFiltersButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6C757D", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignSelf: "flex-start" },
  clearFiltersText: { color: "#FFF", fontSize: 12, fontWeight: "600", marginLeft: 4 },
  pendenciasContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 15 },
  pendenciaCard: { backgroundColor: "#F8F9FA", borderRadius: 10, padding: 15, marginBottom: 12 },
  pendenciaHeader: { flexDirection: "row", alignItems: "center" },
});

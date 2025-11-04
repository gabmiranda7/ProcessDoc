import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function VisualizarPendenciasScreen() {
  const router = useRouter();

  // Pendências iniciam como array vazio (nunca undefined)
  const [pendencias, setPendencias] = useState<any[]>([]);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");

  const [dropdownTipoOpen, setDropdownTipoOpen] = useState(false);
  const [dropdownStatusOpen, setDropdownStatusOpen] = useState(false);
  const [dropdownPrioridadeOpen, setDropdownPrioridadeOpen] = useState(false);

  const tiposDocumento = [
    "Todos",
    "CPF",
    "RG",
    "Certidão de Nascimento",
    "Comprovante de Residência",
    "Procuração",
  ];

  const statusCobrancas = [
    "Todos",
    "Aguardando Cliente",
    "Solicitado",
    "Em Cobrança",
    "Urgente",
    "Vencido",
  ];

  const prioridades = ["Todas", "Baixa", "Média", "Alta", "Urgente"];

  const icones: { [key: string]: React.ComponentProps<typeof MaterialCommunityIcons>["name"] } =
    {
      CPF: "card-account-details-outline",
      RG: "card-account-details",
      "Certidão de Nascimento": "certificate-outline",
      "Comprovante de Residência": "home-outline",
      Procuração: "file-document-outline",
    };

  const coresStatus: { [key: string]: string } = {
    "Aguardando Cliente": "#6C757D",
    Solicitado: "#007BFF",
    "Em Cobrança": "#FFC107",
    Urgente: "#FF6B35",
    Vencido: "#DC3545",
  };

  const coresPrioridade: { [key: string]: string } = {
    Baixa: "#28A745",
    Média: "#FFC107",
    Alta: "#FF6B35",
    Urgente: "#DC3545",
  };

  const limparFiltros = () => {
    setFiltroTipo("");
    setFiltroCliente("");
    setFiltroStatus("");
    setFiltroPrioridade("");
  };

  // Filtragem segura, pendencias nunca undefined
  const pendenciasFiltradas = pendencias
    .filter((p) =>
      filtroCliente ? p.cliente?.toLowerCase().includes(filtroCliente.toLowerCase()) : true
    )
    .filter((p) => (filtroTipo ? p.tipo === filtroTipo : true))
    .filter((p) => (filtroStatus ? p.status === filtroStatus : true))
    .filter((p) => (filtroPrioridade ? p.prioridade === filtroPrioridade : true));

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
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
                  {tiposDocumento.map((tipo) => (
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

            <View style={[styles.inputGroup, { zIndex: dropdownStatusOpen ? 9998 : 1 }]}>
              <Text style={styles.label}>Filtrar por Status</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownStatusOpen(!dropdownStatusOpen)}
              >
                <Text style={{ color: filtroStatus ? "#333" : "#888" }}>
                  {filtroStatus || "Todos os status"}
                </Text>
                <Feather name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {dropdownStatusOpen && (
                <View style={styles.dropdownList}>
                  {statusCobrancas.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFiltroStatus(status === "Todos" ? "" : status);
                        setDropdownStatusOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.inputGroup, { zIndex: dropdownPrioridadeOpen ? 9997 : 1 }]}>
              <Text style={styles.label}>Filtrar por Prioridade</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownPrioridadeOpen(!dropdownPrioridadeOpen)}
              >
                <Text style={{ color: filtroPrioridade ? "#333" : "#888" }}>
                  {filtroPrioridade || "Todas as prioridades"}
                </Text>
                <Feather name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {dropdownPrioridadeOpen && (
                <View style={styles.dropdownList}>
                  {prioridades.map((prio) => (
                    <TouchableOpacity
                      key={prio}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFiltroPrioridade(prio === "Todas" ? "" : prio);
                        setDropdownPrioridadeOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{prio}</Text>
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
            <Text style={styles.sectionTitle}>Documentos Pendentes</Text>
            {pendenciasFiltradas.length === 0 ? (
              <Text style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
                Nenhuma pendência encontrada.
              </Text>
            ) : (
              pendenciasFiltradas.map((p, index) => (
                <View key={index} style={styles.pendenciaItem}>
                  <MaterialCommunityIcons
                    name={icones[p.tipo] || "file-document-outline"}
                    size={24}
                    color="#007BFF"
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{p.cliente}</Text>
                    <Text>{p.tipo}</Text>
                    <Text style={{ color: coresStatus[p.status] }}>{p.status}</Text>
                    <Text style={{ color: coresPrioridade[p.prioridade] }}>{p.prioridade}</Text>
                  </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
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
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingVertical: 20 },
  formCard: {
    width: width * 0.9,
    maxWidth: 600,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#007BFF", textAlign: "center", marginBottom: 20 },
  filtrosContainer: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
  inputGroup: { marginBottom: 15, position: "relative" },
  label: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8, color: "#333", fontSize: 16 },
  dropdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8 },
  dropdownList: { position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, marginTop: 2, zIndex: 10000, elevation: 10 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  dropdownItemText: { color: "#333", fontSize: 16 },
  clearFiltersButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6C757D", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignSelf: "flex-start" },
  clearFiltersText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600", marginLeft: 4 },
  pendenciasContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  pendenciaItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
});

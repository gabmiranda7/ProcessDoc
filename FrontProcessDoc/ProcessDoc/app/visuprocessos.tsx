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
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function VisualizarProcessosScreen() {
  const router = useRouter();

  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroTribunal, setFiltroTribunal] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [dropdownTribunalOpen, setDropdownTribunalOpen] = useState(false);
  const [dropdownStatusOpen, setDropdownStatusOpen] = useState(false);

  const tribunais = ["Todos", "TJSP", "TRF-3", "TRT-2", "STJ", "STF", "TST"];
  const status = ["Todos", "Em Andamento", "Suspenso", "Arquivado", "Sentenciado", "Recurso"];

  const limparFiltros = () => {
    setFiltroNumero("");
    setFiltroCliente("");
    setFiltroTribunal("");
    setFiltroStatus("");
  };

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/inicio")} style={styles.backButton}>
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
          <Text style={styles.title}>Visualizar Processos</Text>

          {/* Filtros */}
          <View style={[styles.filtrosContainer, { zIndex: 10 }]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Buscar por Número</Text>
              <View style={styles.rowInputWithButton}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o número do processo"
                  placeholderTextColor="#888"
                  value={filtroNumero}
                  onChangeText={setFiltroNumero}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
                  <Feather name="search" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

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

            <View style={[styles.inputGroup, { zIndex: dropdownTribunalOpen ? 9999 : 1 }]}>
              <Text style={styles.label}>Filtrar por Tribunal</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownTribunalOpen(!dropdownTribunalOpen)}
              >
                <Text style={{ color: filtroTribunal ? "#333" : "#888" }}>
                  {filtroTribunal || "Todos os tribunais"}
                </Text>
                <Feather name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
              {dropdownTribunalOpen && (
                <View style={styles.dropdownList}>
                  {tribunais.map(tribunal => (
                    <TouchableOpacity
                      key={tribunal}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFiltroTribunal(tribunal === "Todos" ? "" : tribunal);
                        setDropdownTribunalOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{tribunal}</Text>
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
                  {status.map(stat => (
                    <TouchableOpacity
                      key={stat}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFiltroStatus(stat === "Todos" ? "" : stat);
                        setDropdownStatusOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{stat}</Text>
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

          {/* Botão para Cadastrar Novo Processo */}
          <TouchableOpacity
            style={styles.novoProcessoButton}
            onPress={() => router.push("/processos")}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.novoProcessoButtonText}>Cadastrar Novo Processo</Text>
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
    position: "relative",
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
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 2,
    zIndex: 10000,
    elevation: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    color: "#333",
    fontSize: 16,
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
  novoProcessoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  novoProcessoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
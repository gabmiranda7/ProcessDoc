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

export default function VisualizarDocumentosScreen() {
  const router = useRouter();

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [dropdownTipoOpen, setDropdownTipoOpen] = useState(false);

  const tipos = ["Todos", "CPF", "Certidão", "Identidade", "Endereço", "Intimação"];

  return (
    <View style={styles.fullContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/inicio")}
          style={styles.backButton}
        >
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
          <Text style={styles.title}>Visualizar Documentos</Text>

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
                  {tipos.map((tipo) => (
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
          </View>

          {/* Lista de Documentos */}
          <View style={styles.documentosContainer}>
            <Text style={styles.sectionTitle}>Documentos Encontrados</Text>
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={48}
                color="#888"
              />
              <Text style={styles.emptyStateText}>Nenhum documento para exibir</Text>
              <Text style={styles.emptyStateSubtext}>
                Verifique os documentos pendentes.
              </Text>
            </View>
          </View>

          {/* Botão para Cadastrar Novo Documento */}
          <TouchableOpacity
            style={styles.novoDocumentoButton}
            onPress={() => router.push("/documentos")}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.novoDocumentoButtonText}>Cadastrar Novo Documento</Text>
          </TouchableOpacity>
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
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
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
  title: { fontSize: 24, fontWeight: "bold", color: "#007BFF", textAlign: "center", marginBottom: 20 },
  filtrosContainer: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
  inputGroup: { marginBottom: 15, position: "relative" },
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
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  dropdownItemText: { color: "#333", fontSize: 16 },
  documentosContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 15 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyStateText: { fontSize: 16, fontWeight: "600", color: "#666", marginTop: 10 },
  emptyStateSubtext: { fontSize: 14, color: "#888", textAlign: "center", marginTop: 5 },
  novoDocumentoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  novoDocumentoButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});
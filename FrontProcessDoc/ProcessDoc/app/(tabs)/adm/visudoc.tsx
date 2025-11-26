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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../../api";

const { width } = Dimensions.get("window");

export default function VisualizarDocumentosADM() {
  const router = useRouter();

  const [filtroCliente, setFiltroCliente] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [clienteNome, setClienteNome] = useState("");

  const handleProcurar = async () => {
    if (!filtroCliente.trim()) {
      Alert.alert("Erro", "Digite o nome do cliente");
      return;
    }

    try {
      setLoading(true);
      // Chamar API para buscar documentos do cliente
      // const response = await api.documentos.buscarPorCliente(filtroCliente);
      // setDocumentos(response.documentos);
      // setClienteNome(response.nomeCliente);

      // Por enquanto só vai preparar o estado pra quando a API estiver pronta
      setClienteNome(filtroCliente);
      setDocumentos([]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao buscar documentos");
    } finally {
      setLoading(false);
    }
  };

  const limparBusca = () => {
    setFiltroCliente("");
    setDocumentos([]);
    setClienteNome("");
  };

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
          <Text style={styles.title}>Visualizar Documentos</Text>

          {/* Filtros */}
          <View style={styles.filtrosContainer}>
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
          </View>

          {/* Lista de Documentos */}
          <View style={styles.documentosContainer}>
            {clienteNome ? (
              <>
                <Text style={styles.sectionTitle}>Documentos de {clienteNome}</Text>
                {documentos.length > 0 ? (
                  <View>
                    {documentos.map((doc, idx) => (
                      <View key={idx} style={styles.documentoCard}>
                        <MaterialCommunityIcons
                          name="file-document"
                          size={24}
                          color="#1E40AF"
                        />
                        <View style={styles.documentoInfo}>
                          <Text style={styles.documentoNome}>{doc.nome}</Text>
                          <Text style={styles.documentoTipo}>{doc.tipo}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={48}
                      color="#888"
                    />
                    <Text style={styles.emptyStateText}>Nenhum documento encontrado</Text>
                    <Text style={styles.emptyStateSubtext}>
                      Este cliente não possui documentos anexados.
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.limparButton}
                  onPress={limparBusca}
                >
                  <Text style={styles.limparButtonText}>Limpar Busca</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Documentos Encontrados</Text>
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={48}
                    color="#888"
                  />
                  <Text style={styles.emptyStateText}>Nenhum documento para exibir</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Procure por um cliente para ver seus documentos.
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Botão para Procurar Documento */}
          <TouchableOpacity
            style={[styles.novoDocumentoButton, loading && styles.buttonDisabled]}
            onPress={handleProcurar}
            disabled={loading}
          >
            <Feather name="search" size={20} color="#FFFFFF" />
            <Text style={styles.novoDocumentoButtonText}>
              {loading ? "Procurando..." : "Procurar Documento"}
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
    paddingBottom: 100 
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
  inputGroup: { marginBottom: 15 },
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
  documentosContainer: { marginBottom: 20 },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 15 
  },
  documentoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  documentoInfo: {
    marginLeft: 12,
    flex: 1,
  },
  documentoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  documentoTipo: {
    fontSize: 14,
    color: "#666",
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
  limparButton: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  limparButtonText: {
    color: "#1E40AF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  novoDocumentoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  novoDocumentoButtonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "bold", 
    marginLeft: 8 
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },
});
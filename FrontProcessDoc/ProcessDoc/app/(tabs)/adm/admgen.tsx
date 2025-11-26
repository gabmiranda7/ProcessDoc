import React, { useState, useEffect } from "react";
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

const { width } = Dimensions.get("window");

export default function AdmGerenciarUsuarios() {
  const router = useRouter();

  const [filtroEmail, setFiltroEmail] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoDados, setEditandoDados] = useState<any>({});

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      // Aqui você chamaria sua API real para buscar usuários
      // const response = await api.usuarios.listar();
      // setUsuarios(response);
      // Por enquanto usando dados mock para demonstração
      setUsuarios([]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltro = (texto: string) => {
    setFiltroEmail(texto);
    if (texto.trim() === "") {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrado = usuarios.filter((u) =>
        u.email.toLowerCase().includes(texto.toLowerCase())
      );
      setUsuariosFiltrados(filtrado);
    }
  };

  const iniciarEdicao = (usuario: any) => {
    setEditandoId(usuario.id);
    setEditandoDados({ ...usuario });
  };

  const salvarEdicao = async (id: number) => {
    try {
      // Aqui você chamaria sua API real para atualizar usuário
      // await api.usuarios.atualizar(id, editandoDados);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...editandoDados } : u))
      );
      setUsuariosFiltrados((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...editandoDados } : u))
      );
      setEditandoId(null);
      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar usuário");
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoDados({});
  };

  const excluirUsuario = (id: number, email: string) => {
    Alert.alert("Confirmação", `Deseja excluir o usuário ${email}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            // await api.usuarios.excluir(id);
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
            setUsuariosFiltrados((prev) => prev.filter((u) => u.id !== id));
            Alert.alert("Sucesso", "Usuário removido com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Falha ao remover usuário");
          }
        },
      },
    ]);
  };

  const renderUsuario = ({ item }: any) => {
    const estaEditando = editandoId === item.id;

    return (
      <View style={styles.card}>
        {estaEditando ? (
          <>
            <TextInput
              style={styles.inputEdit}
              value={editandoDados.email}
              onChangeText={(text) =>
                setEditandoDados({ ...editandoDados, email: text })
              }
              placeholder="Email"
            />
            <TextInput
              style={styles.inputEdit}
              value={editandoDados.role}
              onChangeText={(text) =>
                setEditandoDados({ ...editandoDados, role: text })
              }
              placeholder="Papel (role)"
            />
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#1E40AF" }]}
                onPress={() => salvarEdicao(item.id)}
              >
                <Feather name="check" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#666" }]}
                onPress={cancelarEdicao}
              >
                <Feather name="x" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>{item.email}</Text>
            <Text style={styles.cardText}>Papel: {item.role}</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#1E40AF" }]}
                onPress={() => iniciarEdicao(item)}
              >
                <Feather name="edit-3" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#D32F2F" }]}
                onPress={() => excluirUsuario(item.id, item.email)}
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
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
          <Text style={styles.title}>Gerenciar Usuários</Text>

          {/* Filtro */}
          <View style={styles.filtrosContainer}>
            <Text style={styles.label}>Digite o nome do usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#888"
              value={filtroEmail}
              onChangeText={handleFiltro}
            />
          </View>

          {/* Lista de Usuários */}
          <View style={styles.usuariosContainer}>
            <Text style={styles.sectionTitle}>Usuários Cadastrados</Text>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Carregando...</Text>
              </View>
            ) : usuariosFiltrados.length > 0 ? (
              <FlatList
                data={usuariosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUsuario}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="account-multiple-outline"
                  size={48}
                  color="#888"
                />
                <Text style={styles.emptyStateText}>Nenhum usuário encontrado</Text>
                <Text style={styles.emptyStateSubtext}>
                  Verifique o filtro ou cadastre um novo usuário.
                </Text>
              </View>
            )}
          </View>
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
  title: { fontSize: 24, fontWeight: "bold", color: "#1E40AF", textAlign: "center", marginBottom: 20 },
  filtrosContainer: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
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
  inputEdit: {
    borderWidth: 1,
    borderColor: "#1E40AF",
    backgroundColor: "#F0F4FF",
    padding: 10,
    borderRadius: 8,
    color: "#333",
    fontSize: 14,
    marginBottom: 10,
  },
  usuariosContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 15 },
  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1E40AF",
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#1E40AF" },
  cardText: { color: "#666", marginTop: 5, fontSize: 14 },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyStateText: { fontSize: 16, fontWeight: "600", color: "#666", marginTop: 10 },
  emptyStateSubtext: { fontSize: 14, color: "#888", textAlign: "center", marginTop: 5 },
});
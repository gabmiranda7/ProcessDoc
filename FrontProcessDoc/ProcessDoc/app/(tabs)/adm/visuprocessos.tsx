import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProcessosVisualizar() {
  const router = useRouter();
  const [processos, setProcessos] = useState<any[]>([]);

  useEffect(() => {
    // mock inicial — troque por fetch da API quando integrar
    setProcessos([
      {
        id: 1,
        numero: "0000001-00.0000.0.00.0000",
        tribunal: "TJSP",
        cliente: "Maria Silva",
        status: "Em Andamento",
        prazo: "20/11/2025",
      },
      {
        id: 2,
        numero: "0000002-00.0000.0.00.0000",
        tribunal: "TRF-3",
        cliente: "João Pereira",
        status: "Suspenso",
        prazo: "05/12/2025",
      },
    ]);
  }, []);

  const handleVer = (proc: any) => {
    Alert.alert("Processo", `${proc.numero}\n${proc.tribunal}\nCliente: ${proc.cliente}`);
  };

  const handleExcluir = (proc: any) => {
    Alert.alert(
      "Excluir processo",
      `Deseja excluir o processo ${proc.numero}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setProcessos((prev) => prev.filter((p) => p.id !== proc.id));
            Alert.alert("Sucesso", "Processo excluído.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Processos</Text>
      </View>

      <FlatList
        data={processos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Feather name="file" size={20} color="#1E40AF" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.numero}>{item.numero}</Text>
                <Text style={styles.meta}>{item.tribunal} • {item.cliente}</Text>
                <Text style={styles.prazo}>Prazo: {item.prazo}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#007BFF" }]} onPress={() => handleVer(item)}>
                <Feather name="eye" size={14} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#DC3545" }]} onPress={() => handleExcluir(item)}>
                <Feather name="trash-2" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="file-minus" size={48} color="#888" />
            <Text style={styles.emptyText}>Nenhum processo cadastrado</Text>
            <Text style={styles.emptySub}>Cadastre novos processos pelo painel.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F2FF", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1E40AF" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  numero: { fontWeight: "700", color: "#1E40AF" },
  meta: { color: "#555", marginTop: 4 },
  prazo: { color: "#666", marginTop: 4, fontSize: 13 },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { alignItems: "center", marginTop: 40 },
  emptyText: { marginTop: 12, fontSize: 16, fontWeight: "600", color: "#666" },
  emptySub: { color: "#888", marginTop: 6 },
});

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function VisuPendencias() {
  const router = useRouter();
  const [pendencias, setPendencias] = useState<any[]>([]);

  useEffect(() => {
    // Mock — simula pendências cadastradas
    setPendencias([
      {
        id: 1,
        titulo: "RG do cliente",
        descricao: "Enviar cópia legível do RG atualizado.",
        prazo: "15/11/2025",
      },
      {
        id: 2,
        titulo: "Contrato de serviços",
        descricao: "Assinar e enviar o contrato digital.",
        prazo: "20/11/2025",
      },
      {
        id: 3,
        titulo: "Comprovante de residência",
        descricao: "Enviar comprovante atualizado (últimos 3 meses).",
        prazo: "25/11/2025",
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pendências</Text>
      </View>

      {/* Lista de pendências */}
      <FlatList
        data={pendencias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Feather name="alert-circle" size={26} color="#1E40AF" />
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.description}>{item.descricao}</Text>
              <View style={styles.dateRow}>
                <Feather name="calendar" size={16} color="#1E40AF" />
                <Text style={styles.dateText}>Prazo: {item.prazo}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F2FF", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1E40AF" },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLeft: { justifyContent: "center", marginRight: 10 },
  cardRight: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", color: "#1E40AF" },
  description: { fontSize: 14, color: "#555", marginTop: 4 },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 },
  dateText: { fontSize: 13, color: "#333" },
});

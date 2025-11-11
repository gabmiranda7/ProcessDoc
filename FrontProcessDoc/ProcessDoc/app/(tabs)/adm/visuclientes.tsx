import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function VisuClientes() {
  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    // Mock simples
    setClientes([
      { id: 1, nome: "Maria Silva", cpf: "123.456.789-00", telefone: "(11) 99999-9999" },
      { id: 2, nome: "João Pereira", cpf: "987.654.321-00", telefone: "(21) 98888-7777" },
      { id: 3, nome: "Ana Souza", cpf: "555.222.999-88", telefone: "(31) 97777-4444" },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/adm/adm")}>
          <Feather name="arrow-left" size={26} color="#1E40AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clientes</Text>
      </View>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Feather name="user" size={24} color="#1E40AF" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>CPF: {item.cpf}</Text>
              <Text style={styles.info}>Tel: {item.telefone}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F2FF", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25, gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1E40AF" },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#1E40AF" },
  info: { fontSize: 14, color: "#555" },
});

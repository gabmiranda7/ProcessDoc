import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function AdmPainel() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel Administrativo ⚖️</Text>
      <Text style={styles.subtitle}>Gerencie processos, clientes e documentos.</Text>

      <View style={styles.cardGrid}>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/clientes")}>
          <Image source={require("../assets/clientes.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/documentos")}>
          <Image source={require("../assets/doc.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Documentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/processos")}>
          <Image source={require("../assets/processos.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Processos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/admgen")}>
          <Image source={require("../assets/adm.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Gerenciar Clientes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#E9F2FF", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#0052CC", marginBottom: 5 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 20 },
  cardGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "45%",
    alignItems: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: { width: 60, height: 60, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#0052CC" },
});

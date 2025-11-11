import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function AdmPainel() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel Administrativo ⚖️</Text>
      <Text style={styles.subtitle}>Gerencie processos, clientes, documentos, pendências e usuários!.</Text>

      <View style={styles.cardGrid}>
        {/* CLIENTES */}
        <View style={styles.card}>
          <Image source={require("../../../assets/clientes.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Clientes</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/clientes")}>
              <Text style={styles.btnText}>Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/visuclientes")}>
              <Text style={styles.btnText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DOCUMENTOS */}
        <View style={styles.card}>
          <Image source={require("../../../assets/doc.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Documentos</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/documentos")}>
              <Text style={styles.btnText}>Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/visudoc")}>
              <Text style={styles.btnText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PENDÊNCIAS */}
        <View style={styles.card}>
          <Image source={require("../../../assets/pendencias.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Pendências</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/pendencias")}>
              <Text style={styles.btnText}>Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/visupendencias")}>
              <Text style={styles.btnText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PROCESSOS */}
        <View style={styles.card}>
          <Image source={require("../../../assets/processos.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Processos</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/processos")}>
              <Text style={styles.btnText}>Novo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/visuprocessos")}>
              <Text style={styles.btnText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* GERENCIAR CLIENTES */}
        <View style={styles.card}>
          <Image source={require("../../../assets/adm.png")} style={styles.icon} />
          <Text style={styles.cardTitle}>Gerenciar Usuários</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/adm/admgen")}>
              <Text style={styles.btnText}>Acessar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#0052CC", marginBottom: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  btn: {
    flex: 1,
    backgroundColor: "#0052CC",
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});

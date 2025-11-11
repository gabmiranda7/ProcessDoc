import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function InicioCliente() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <Text style={styles.subtitle}>Escolha uma das opções abaixo:</Text>

      <View style={styles.grid}>
        {/* Enviar Documentos */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/doc.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Enviar Documentos</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/cliente/enviardocs")}
          >
            <Feather name="upload" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Visualizar Documentos */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/doc.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Visualizar Documentos</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/cliente/visualizardocs")}
          >
            <Feather name="file-text" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Pendências */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/pendencias.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Ver Pendências</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/cliente/pendenciascli")}
          >
            <Feather name="alert-circle" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Processos */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/processos.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Visualizar Processos</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/cliente/processoscli")}
          >
            <Feather name="folder" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Solicitar Alteração */}
        <View style={styles.card}>
          <Image
            source={require("../../../assets/editar.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Solicitar Alteração</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/cliente/alterar")}
          >
            <Feather name="edit" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E9F2FF",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0052CC",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "45%",
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0052CC",
    textAlign: "center",
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: "#0052CC",
    padding: 10,
    borderRadius: 10,
  },
});

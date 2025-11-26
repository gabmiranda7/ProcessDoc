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

export default function AdmPainel() {
  const menuGroups = [
    {
      title: "Clientes",
      icon: require("../../../assets/clientes.png"),
      actions: [
        { label: "Novo", icon: "user-plus", route: "/(tabs)/adm/clientes" },
        { label: "Ver", icon: "users", route: "/(tabs)/adm/visuclientes" },
      ],
    },
    {
      title: "Documentos",
      icon: require("../../../assets/doc.png"),
      actions: [
        { label: "Ver", icon: "file-text", route: "/(tabs)/adm/visudoc" },
      ],
    },
    {
      title: "Pendências",
      icon: require("../../../assets/pendencias.png"),
      actions: [
        { label: "Novo", icon: "plus-circle", route: "/(tabs)/adm/pendencias" },
        { label: "Ver", icon: "alert-circle", route: "/(tabs)/adm/visupendencias" },
      ],
    },
    {
      title: "Processos",
      icon: require("../../../assets/processos.png"),
      actions: [
        { label: "Novo", icon: "plus-circle", route: "/(tabs)/adm/processos" },
        { label: "Ver", icon: "folder", route: "/(tabs)/adm/visuprocessos" },
      ],
    },
    {
      title: "Gerenciar Usuários",
      icon: require("../../../assets/adm.png"),
      actions: [
        { label: "", icon: "settings", route: "/(tabs)/adm/admgen" },
      ],
    },
    {
      title: "Visualizar Solicitações",
      icon: require("../../../assets/solicitacoes.png"),
      actions: [
        { label: "", icon: "eye", route: "/(tabs)/adm/visusolicitacoes" },
      ],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <Text style={styles.subtitle}>Escolha uma das opções abaixo:</Text>

      <View style={styles.grid}>
        {menuGroups.map((group, index) => (
          <View key={index} style={styles.card}>
            <Image source={group.icon} style={styles.icon} />
            <Text style={styles.cardTitle}>{group.title}</Text>
            <View style={styles.buttonRow}>
              {group.actions.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.actionButton}
                  onPress={() => router.push(action.route as any)}
                >
                  <Feather name={action.icon as any} size={16} color="#fff" />
                  {action.label && <Text style={styles.buttonText}>{action.label}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "47%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#0052CC",
    textAlign: "center",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  actionButton: {
    backgroundColor: "#0052CC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
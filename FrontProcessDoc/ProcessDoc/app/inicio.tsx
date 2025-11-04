import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function InicioScreen() {
  const router = useRouter();

  const cardData = [
    {
      title: "Documentos",
      icon: require("../assets/doc.png"),
      actions: [
        { label: "Visualizar", onPress: () => router.push("/visudoc") },
        { label: "Cadastrar", onPress: () => router.push("/documentos") },
      ],
    },
    {
      title: "Clientes",
      icon: require("../assets/clientes.png"),
      actions: [
        { label: "Pesquisar", onPress: () => router.push("/visuclientes") },
        { label: "Cadastrar", onPress: () => router.push("/clientes") },
      ],
    },
    {
      title: "Processos",
      icon: require("../assets/processos.png"),
      actions: [
        { label: "Visualizar", onPress: () => router.push("/visuprocessos") },
        { label: "Cadastrar", onPress: () => router.push("/processos") },
      ],
    },
    {
      title: "Pendências",
      icon: require("../assets/pendencias.png"),
      actions: [
        { label: "Visualizar", onPress: () => router.push("/visupendencias") },
        { label: "Cadastrar", onPress: () => router.push("/pendencias") },
      ],
    },
  ];

  return (
    <View style={styles.fullContainer}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Process Doc</Text>

        {/* Botão de sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {cardData.map((card, index) => (
            <View key={index} style={styles.card}>
              <Image source={card.icon} style={styles.cardIcon} />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <View style={styles.buttonGroup}>
                {card.actions.map((action, actionIndex) => (
                  <TouchableOpacity
                    key={actionIndex}
                    style={styles.button}
                    onPress={action.onPress}
                  >
                    <Text style={styles.buttonText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#E0F2F7", // fundo azul claro
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 40, // espaço para a barra de status
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  logoutButton: {
    position: "absolute",
    right: 20,
    top: 45,
  },
  logoutText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "48%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cardIcon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  buttonGroup: {
    width: "100%",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

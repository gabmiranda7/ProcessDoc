import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProcessDoc 📑</Text>
      <Text style={styles.subtitle}>Controle de prazos e documentos jurídicos</Text>

      {/* Botão Criar Conta */}
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>
      </Link>

      {/* Botão Entrar (para login futuramente) */}
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonPrimary: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#444",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

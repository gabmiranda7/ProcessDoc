import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  React.useEffect(() => {
    // Redireciona automaticamente pra tela de login
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 500); // pequeno delay só pra evitar piscar

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2F7",
  },
});

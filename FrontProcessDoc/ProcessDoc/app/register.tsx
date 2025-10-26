import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";
import MaskInput from "react-native-mask-input"; 
import { userApi } from "../api/index";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    padding: 20,
  },
  loginBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0052CC",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  placeholderIcon: {
    width: 20,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: "#333",
    fontSize: 16,
  },
  forgotPassword: {
    color: "#0052CC",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D9E6",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  registerButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
  },
  yearInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderWidth: 1,
    borderColor: "#D1D9E6",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    flex: 1,
  },
});

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "", 
    password: "",
    confirmPassword: "",
    day: "",
    month: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const CPF_MASK = [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];

  type Field = keyof typeof form;

  const handleChange = (field: Field, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.cpf ||
      !form.password ||
      !form.confirmPassword ||
      !form.day ||
      !form.month ||
      !form.year
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const dateOfBirth = `${form.year}-${form.month.padStart(
      2,
      "0"
    )}-${form.day.padStart(2, "0")}`;

    setLoading(true);
    try {
      const userData = {
        name: form.name,
        email: form.email,
        cpf: form.cpf.replace(/[.-]/g, ""), 
        dateOfBirth: dateOfBirth,
        password: form.password,
      };

      await userApi.register(userData);

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Não foi possível realizar o cadastro.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginBox}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Novo Cadastro</Text>

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor="#888"
            autoCapitalize="words"
            value={form.name}
            onChangeText={(t) => handleChange("name", t)}
          />
          <View style={styles.placeholderIcon} />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => handleChange("email", t)}
          />
          <View style={styles.placeholderIcon} />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="credit-card" size={20} color="#888" style={styles.icon} />
          <MaskInput
            style={styles.input}
            placeholder="CPF (apenas números)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={form.cpf}
            onChangeText={(masked, unmasked) => handleChange("cpf", masked)}
            mask={CPF_MASK}
          />
          <View style={styles.placeholderIcon} />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible}
            value={form.password}
            onChangeText={(t) => handleChange("password", t)}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#888"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            placeholderTextColor="#888"
            secureTextEntry={!isConfirmPasswordVisible}
            value={form.confirmPassword}
            onChangeText={(t) => handleChange("confirmPassword", t)}
          />
          <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
            <Feather
              name={isConfirmPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#888"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        <Text style={{ ...styles.forgotPassword, alignSelf: "flex-start", marginBottom: 5 }}>
          Data de Nascimento
        </Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Dia"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={2}
              value={form.day}
              onChangeText={(t) => handleChange("day", t)}
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Mês"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={2}
              value={form.month}
              onChangeText={(t) => handleChange("month", t)}
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.yearInputContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Ano"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={4}
              value={form.year}
              onChangeText={(t) => handleChange("year", t)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>REGISTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.forgotPassword}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
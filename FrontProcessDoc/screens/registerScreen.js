import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    cep: "",
    dateOfBirth: "",
    password: "",
    role: "ADVOGADO",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const register = async () => {
    try {
      const res = await fetch("http://10.0.2.2:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sucesso", data.message);
      } else {
        Alert.alert("Erro", data.error || "Falha no cadastro");
      }
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={form.name}
        onChangeText={(t) => handleChange("name", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(t) => handleChange("email", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        keyboardType="numeric"
        value={form.cpf}
        onChangeText={(t) => handleChange("cpf", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        keyboardType="numeric"
        value={form.cep}
        onChangeText={(t) => handleChange("cep", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (AAAA-MM-DD)"
        value={form.dateOfBirth}
        onChangeText={(t) => handleChange("dateOfBirth", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => handleChange("password", t)}
      />
      <Button title="Cadastrar" onPress={register} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import MaskInput from "react-native-mask-input";

const { width } = Dimensions.get("window");

export default function CadastrarProcessoScreen() {
  const router = useRouter();

  const [numeroProcesso, setNumeroProcesso] = useState("");
  const [tribunal, setTribunal] = useState("");
  const [dropdownTribunalOpen, setDropdownTribunalOpen] = useState(false);
  const [varaComarca, setVaraComarca] = useState("");
  const [naturezaAcao, setNaturezaAcao] = useState("");
  const [dropdownNaturezaOpen, setDropdownNaturezaOpen] = useState(false);
  const [clienteAssociado, setClienteAssociado] = useState("");
  const [parteContraria, setParteContraria] = useState("");
  const [statusProcesso, setStatusProcesso] = useState("");
  const [dropdownStatusOpen, setDropdownStatusOpen] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  const tribunais = ["TJSP", "TRF-3", "STJ", "STF", "TST", "TRT-2", "TRT-15"];
  const naturezas = ["Cível", "Trabalhista", "Criminal", "Tributário", "Previdenciário", "Família"];
  const status = ["Em Andamento", "Suspenso", "Arquivado", "Sentenciado", "Recurso"];

  const processoMask = [
    /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.',
    /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/
  ];

  const handleCadastrarProcesso = () => {
    if (!numeroProcesso || !tribunal || !varaComarca || !naturezaAcao || !clienteAssociado) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    Alert.alert(
      "Sucesso",
      `Processo cadastrado!\nNúmero: ${numeroProcesso}\nTribunal: ${tribunal}\nCliente: ${clienteAssociado}`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const limparFormulario = () => {
    setNumeroProcesso("");
    setTribunal("");
    setVaraComarca("");
    setNaturezaAcao("");
    setClienteAssociado("");
    setParteContraria("");
    setStatusProcesso("");
    setObservacoes("");
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#007BFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image source={require("../assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Process Doc</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Cadastro de Processo</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número do Processo *</Text>
            <MaskInput
              mask={processoMask}
              style={styles.input}
              placeholder="0000000-00.0000.0.00.0000"
              value={numeroProcesso}
              onChangeText={setNumeroProcesso}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { zIndex: dropdownTribunalOpen ? 9999 : 1 }]}>
            <Text style={styles.label}>Tribunal *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownTribunalOpen(!dropdownTribunalOpen)}>
              <Text style={{ color: tribunal ? "#333" : "#888" }}>
                {tribunal || "Selecione o tribunal"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {dropdownTribunalOpen && (
              <View style={styles.dropdownList}>
                {tribunais.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={styles.dropdownItem}
                    onPress={() => { setTribunal(t); setDropdownTribunalOpen(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vara/Comarca *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1ª Vara Cível"
              value={varaComarca}
              onChangeText={setVaraComarca}
            />
          </View>

          <View style={[styles.inputGroup, { zIndex: dropdownNaturezaOpen ? 9998 : 1 }]}>
            <Text style={styles.label}>Natureza da Ação *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownNaturezaOpen(!dropdownNaturezaOpen)}>
              <Text style={{ color: naturezaAcao ? "#333" : "#888" }}>
                {naturezaAcao || "Selecione a natureza"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {dropdownNaturezaOpen && (
              <View style={styles.dropdownList}>
                {naturezas.map(n => (
                  <TouchableOpacity key={n} style={styles.dropdownItem} onPress={() => { setNaturezaAcao(n); setDropdownNaturezaOpen(false); }}>
                    <Text style={styles.dropdownItemText}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cliente Associado *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do cliente"
              value={clienteAssociado}
              onChangeText={setClienteAssociado}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parte Contrária</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da parte contrária"
              value={parteContraria}
              onChangeText={setParteContraria}
            />
          </View>

          <View style={[styles.inputGroup, { zIndex: dropdownStatusOpen ? 9997 : 1 }]}>
            <Text style={styles.label}>Status do Processo</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownStatusOpen(!dropdownStatusOpen)}>
              <Text style={{ color: statusProcesso ? "#333" : "#888" }}>
                {statusProcesso || "Selecione o status"}
              </Text>
              <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {dropdownStatusOpen && (
              <View style={styles.dropdownList}>
                {status.map(s => (
                  <TouchableOpacity key={s} style={styles.dropdownItem} onPress={() => { setStatusProcesso(s); setDropdownStatusOpen(false); }}>
                    <Text style={styles.dropdownItemText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observações adicionais"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={limparFormulario}>
              <Feather name="x" size={20} color="#FFF" />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleCadastrarProcesso}>
              <Feather name="check" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: "#E0F2F7" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E0E0E0", paddingTop: 40 },
  backButton: { paddingRight: 10 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "center", marginRight: 34 },
  headerLogo: { width: 30, height: 30, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingVertical: 20 },
  formCard: { width: width * 0.9, maxWidth: 600, backgroundColor: "#FFF", borderRadius: 15, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#007BFF", textAlign: "center", marginBottom: 20 },
  inputGroup: { marginBottom: 15, position: "relative" },
  label: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8, color: "#333", fontSize: 16 },
  textArea: { height: 100, paddingTop: 12 },
  rowInputWithButton: { flexDirection: "row", alignItems: "center" },
  searchButton: { backgroundColor: "#007BFF", padding: 12, borderRadius: 8, marginLeft: 10 },
  dropdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#F9F9F9", padding: 12, borderRadius: 8 },
  dropdownList: { position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, marginTop: 2, zIndex: 10000, elevation: 10 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  dropdownItemText: { color: "#333", fontSize: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  clearButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6C757D", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 0.45, justifyContent: "center" },
  clearButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  submitButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#007BFF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 0.45, justifyContent: "center" },
  submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});
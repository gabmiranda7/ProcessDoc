import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * 🔧 Retorna a URL base da API conforme o ambiente
 */
export const getApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  // Ajuste conforme sua rede local
  const localIp = "192.168.X.X"; // Exemplo: 192.168.0.10

  return Platform.OS === "android"
    ? `http://${localIp}:5000`
    : "http://localhost:5000";
};

const API_URL = getApiUrl();
console.log("🔗 API URL configurada:", API_URL);

/* ============================================================
   🔒 MOCKS TEMPORÁRIOS (SEM BANCO DE DADOS)
============================================================ */

const mockUsers = [
  { email: "cliente@teste.com", password: "123", role: "cliente" },
  { email: "adm@teste.com", password: "123", role: "adm" },
];

const mockClientes = [
  {
    id: 1,
    nomeCompleto: "Maria Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-9999",
  },
];

/* ============================================================
   🔑 AUTENTICAÇÃO (Mock)
============================================================ */

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    console.log("📤 Tentando login...", credentials);

    const user = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    );

    await new Promise((resolve) => setTimeout(resolve, 600)); // delay fake

    if (!user) throw new Error("Credenciais inválidas");

    return {
      token: "mock-token",
      role: user.role,
    };
  },
};

/* ============================================================
   👤 CLIENTES (Mock)
============================================================ */

export const clientesApi = {
  cadastrar: async (cliente: {
    nomeCompleto: string;
    cpf: string;
    telefone: string;
  }) => {
    console.log("📤 Cadastrando cliente (mock):", cliente);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const novoCliente = { id: Date.now(), ...cliente };
    mockClientes.push(novoCliente);
    return novoCliente;
  },

  listar: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockClientes];
  },

  excluir: async (cpf: string) => {
    const index = mockClientes.findIndex((c) => c.cpf === cpf);
    if (index >= 0) {
      mockClientes.splice(index, 1);
      console.log("🗑️ Cliente removido:", cpf);
      return true;
    }
    throw new Error("Cliente não encontrado");
  },
};

/* ============================================================
   🌎 EXPORTAÇÕES
============================================================ */

export default {
  auth: authApi,
  clientes: clientesApi,
  getApiUrl,
};

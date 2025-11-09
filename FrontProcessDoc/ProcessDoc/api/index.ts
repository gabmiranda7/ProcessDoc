import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Retorna a URL base da API dependendo do ambiente (local, Android, etc.)
 */
export const getApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  // 🔧 Ajuste o IP local abaixo para o seu
  if (Platform.OS === "android") {
    return "http://192.168.X.X:5000"; // Ex: 192.168.0.10
  } else {
    return "http://localhost:5000";
  }
};

const API_URL = getApiUrl();
console.log("🔗 API URL configurada:", API_URL);

/**
 * Mock temporário de usuários para login (sem banco de dados)
 */
const mockUsers = [
  { email: "cliente@teste.com", password: "123", role: "cliente" },
  { email: "adm@teste.com", password: "123", role: "adm" },
];

/**
 * API de autenticação mockada
 */
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    console.log("📤 Tentando login...", credentials);

    // Simula verificação de credenciais
    const user = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    return {
      token: "mock-token",
      role: user.role,
    };
  },
};

/**
 * API de clientes (mock temporário)
 */
export const clientesApi = {
  cadastrar: async (cliente: any) => {
    console.log("📤 Enviando cliente (mock):", cliente);

    // Simula envio de dados ao servidor
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },

  listar: async () => {
    // Simula retorno de lista de clientes
    return [
      {
        id: 1,
        nomeCompleto: "Maria Silva",
        cpf: "123.456.789-00",
        telefone: "(11) 99999-9999",
      },
    ];
  },
};

export default {
  auth: authApi,
  clientes: clientesApi,
  getApiUrl,
};

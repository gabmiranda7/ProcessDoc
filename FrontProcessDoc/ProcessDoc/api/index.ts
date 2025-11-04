import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  if (Platform.OS === 'android') {
    // substitua pelo IP da sua máquina quando for conectar ao backend (ex: 192.168.0.10:5000)
    return 'http://192.168.X.X:5000';
  } else {
    return 'http://localhost:5000';
  }
};

const API_URL = getApiUrl();

console.log('🔗 API URL configurada:', API_URL);

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  console.log(`📤 ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Erro ${response.status}:`, data);
      throw new Error(data.error || `Erro: ${response.status}`);
    }

    console.log(`✅ Sucesso:`, data);
    return data;
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
};

export const authApi = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

export const userApi = {
  register: async (userData: {
    name: string;
    email: string;
    cpf: string;
    cep?: string;
    dateOfBirth?: string | null;
    password: string;
    role?: string;
  }) => {
    return apiRequest('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async (token: string) => {
    return apiRequest('/api/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/* ---------------------------
   ADICIONEI clientesApi AQUI
   --------------------------- */
export const clientesApi = {
  listar: async () => {
    return apiRequest('/api/clientes', {
      method: 'GET',
    });
  },

  cadastrar: async (clienteData: {
    nomeCompleto: string;
    dataNascimento: string;
    cpf: string;
    endereco: string;
    telefone: string;
    processo?: string;
  }) => {
    return apiRequest('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    });
  },

  obterPorId: async (id: number) => {
    return apiRequest(`/api/clientes/${id}`, {
      method: 'GET',
    });
  },

  editar: async (id: number, clienteData: any) => {
    return apiRequest(`/api/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData),
    });
  },

  excluir: async (id: number) => {
    return apiRequest(`/api/clientes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authApi,
  user: userApi,
  clientes: clientesApi,
  getApiUrl,
};

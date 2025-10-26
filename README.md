# ProcessDoc - Sistema de Gerenciamento de Processos

Este é o repositório do sistema **ProcessDoc**, uma solução completa para gerenciamento de processos legais, desenvolvida com uma arquitetura moderna baseada em Node.js e React Native.

## 🌟 Visão Geral

O projeto é dividido em dois módulos principais:

*   **Backend (`BackProcessDoc`):** API RESTful para manipulação de dados e lógica de negócio.
*   **Frontend (`FrontProcessDoc`):** Aplicação mobile desenvolvida com React Native e Expo.

## 🛠️ Tecnologias Utilizadas

| Módulo | Tecnologias Principais |
| :--- | :--- |
| **Backend** | Node.js, Express, Prisma ORM, PostgreSQL, JWT, Bcrypt |
| **Frontend** | React Native, Expo, React Navigation |

## 🏗️ Estrutura do Projeto

```
.
├── BackProcessDoc/      # Backend API
└── FrontProcessDoc/     # Frontend Mobile
```

---

## 🚀 Backend - Configuração e Execução

### Pré-requisitos

*   Node.js 18+
*   PostgreSQL (Certifique-se de que o serviço está rodando)
*   Database `processdoc` criado no PostgreSQL

### Configuração Inicial

1.  **Navegue para o diretório do backend:**
    ```bash
    cd BackProcessDoc
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou pnpm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie o arquivo `.env` na raiz do diretório `BackProcessDoc` e adicione suas credenciais.
    ```env
    DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/processdoc?schema=public"
    JWT_SECRET="SUA_CHAVE_SECRETA_UNICA_AQUI"
    PORT=3000
    ```

4.  **Gere o Prisma Client e aplique as migrações:**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

### Executar o Servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```
O servidor estará rodando em: `http://localhost:3000`

---

## 📱 Frontend - Configuração e Execução

### Pré-requisitos

*   Node.js 18+
*   Expo CLI instalado globalmente: `npm install -g expo-cli`
*   Backend rodando (localmente ou na nuvem)

### Configuração Inicial

1.  **Navegue para o diretório do frontend:**
    ```bash
    cd FrontProcessDoc/ProcessDoc
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou pnpm install
    ```

3.  **Configure a URL da API:**
    Crie o arquivo `.env` na raiz do diretório `FrontProcessDoc/ProcessDoc` para apontar para o seu backend.
    ```env
    # Se o backend estiver rodando localmente (recomendado para Android Emulator e Web)
    EXPO_PUBLIC_API_URL="http://10.0.2.2:3000"

    # Se estiver usando um dispositivo físico, use o IP da sua máquina
    # EXPO_PUBLIC_API_URL="http://SEU_IP_LOCAL:3000"
    ```

### Executar o App

```bash
npm start
# ou npx expo start
```
Use o QR Code gerado para abrir o aplicativo no seu celular com o **Expo Go**, ou pressione **`w`** para abrir no navegador.

---

## 🛡️ Segurança e Modelo de Dados

### Autenticação
*   Autenticação via **JWT** (JSON Web Tokens).
*   Senhas hasheadas com **Bcrypt** para segurança.
*   Rotas protegidas por middleware de autenticação.

### Tipos de Usuário
O sistema define três perfis de acesso:
*   **ADMIN**
*   **ADVOGADO**
*   **SECRETARIA**

### Entidades Principais (Prisma Schema)
*   `User`
*   `Process`
*   `Document`
*   `Deadline`
*   `ProcessHistory`
*   `Notification`
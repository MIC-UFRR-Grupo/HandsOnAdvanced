#  ⚠️ Projeto Migrado para:  ⚠️
## 📌 [https://github.com/EricaCamila/frota-leste-3](https://github.com/EricaCamila/frota-leste-3) 
<br>

----

# Sistema de Gestão de Frota Hospitalar

Sistema para gerenciamento de veículos, motoristas e geração de relatórios.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Linguagem:** JavaScript/React
- **Framework:** React.js
- **Bibliotecas Principais:**
  - Material-UI (MUI) - Interface gráfica moderna e responsiva
  - React Router - Navegação entre páginas
  - Axios - Requisições HTTP
  - Date-fns - Manipulação de datas

### Backend
- **Linguagem:** JavaScript (Node.js)
- **Framework:** Express.js
- **Banco de Dados:** Firebase Realtime Database
- **Bibliotecas Principais:**
  - Firebase Admin SDK - Integração com Firebase
  - CORS - Permissão de requisições entre domínios
  - Dotenv - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
Projeto/
├── frontend/                    # Aplicação React
│   ├── src/
│   │   ├── pages/              # Componentes de páginas
│   │   │   ├── Dashboard.js    # Página inicial
│   │   │   ├── Veiculos.js     # Gestão de veículos
│   │   │   ├── Motoristas.js   # Gestão de motoristas
│   │   │   └── Relatorios.js   # Geração de relatórios
│   │   ├── services/           # Serviços de API
│   │   │   ├── api.js          # Configuração do Axios
│   │   │   ├── veiculoService.js
│   │   │   ├── motoristaService.js
│   │   │   └── relatorioService.js
│   │   └── ...
│   └── package.json            # Dependências do frontend
│
└── backend/                    # Servidor Node.js/Express
    ├── routes/                 # Rotas da API
    │   ├── veiculos.js        # Rotas de veículos
    │   ├── motoristas.js      # Rotas de motoristas
    │   └── relatorios.js      # Rotas de relatórios
    ├── .env                   # Variáveis de ambiente
    └── package.json           # Dependências do backend
```

## 🔧 Funcionalidades

### Veículos
- Cadastro de veículos
- Listagem de veículos
- Atualização de informações
- Exclusão de veículos

### Motoristas
- Cadastro de motoristas
- Listagem de motoristas
- Atualização de informações
- Exclusão de motoristas

### Relatórios
- Geração de relatórios por período
- Filtros personalizados
- Visualização de dados em tempo real

## 🛠️ Configuração do Ambiente

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm start
```

## ⚙️ Configuração do Firebase

1. Crie um projeto no Firebase Console
2. Gere as credenciais do serviço
3. Configure o arquivo `.env` com:
   ```
   PORT=3001
   FIREBASE_PROJECT_ID=seu-projeto-id
   ```
4. Adicione o arquivo `serviceAccountKey.json` no diretório backend

## 🔒 Segurança

- Autenticação via Firebase
- CORS configurado para origens específicas
- Validação de dados no backend
- Tratamento de erros


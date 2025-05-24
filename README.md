# 🏆 App Sistema de Apostas

Desafio técnico para atuar como desenvolvedor fullstack na donald.bet que simula um módulo simplificado de apostas esportivas, com backend em Python e frontend em React.

## 🚀 Tecnologias Utilizadas

- Backend: Python (FastAPI)
- Frontend: React
- Autenticação: JWT
- Banco de Dados: MySQL
- Docker: Para containerização

## ✅ Funcionalidades principais Implementadas

- [x] Login com JWT
- [x] Listagem de eventos para apostar
- [x] Registro de múltiplas apostas
- [x] Consulta do histórico de apostas com status
- [x] Frontend com login, dashboard e histórico
- [x] Backend com autenticação, endpoints para eventos e apostas

## 🧑‍💻 Como Executar

**Pré-requisitos**:
- Docker
- Docker Compose

**1. Variáveis de ambiente**
Crie um arquivo `.env` na raiz com as seguintes chaves:
```
MYSQL_ROOT_PASSWORD=SUASENHA
MYSQL_DATABASE=betting_app <-- Precisa ser exatamente esse nome>
MYSQL_USER=usuario
MYSQL_PASSWORD=senha
VITE_API_URL=http://localhost:8000
```

**2. Iniciar containers**
```bash
docker-compose up --build
```

**3. Acessar aplicação**
- Frontend: http://localhost:5173
- Swagger API: http://localhost:8000/docs

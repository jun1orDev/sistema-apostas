# 🏆 App Sistema de Apostas

Desafio técnico para atuar como desenvolvedor fullstack na donald.bet que simula um módulo simplificado de apostas esportivas, com backend em Python e frontend em React.

## 🚀 Tecnologias Utilizadas

- Backend: Python (FastAPI)
- Frontend: React + Tailwind CSS
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

## 🧮 Funcionalidades de Regras de Negócio que consegui implementar (Backend)

- Cadastro de usuário com geração de saldo inicial aleatório.
- Seed de eventos com geração de datas futuras (1–7 dias adiante) e odds aleatórias (casa, empate, fora).
- Endpoint `POST /bets` aceita array de apostas com `event_id`, `amount` e `selected_option`.
- Verificação de saldo suficiente antes de processar apostas múltiplas.
- Débito do saldo do usuário pelo valor total das apostas.
- Atribuição de status aleatório a cada aposta: `vencida`, `pendente` ou `perdida`.
- Cálculo de lucro (`profit`) para apostas vencidas: `profit = amount × odd_selected_option - amount`.
- Persistência dos campos `selected_option` e `profit` na tabela de apostas.
- Endpoint `GET /bets` retorna histórico completo do usuário com odds, status e lucro.
- Endpoint `GET /users/me` retorna dados do usuário, incluindo saldo atualizado.

## 🎨 Funcionalidades do Frontend que consegui implementar

- Header compartilhado com logo, menu de navegação e exibição de saldo (quando logado).
- Páginas de Login e Cadastro com formulários, validação de erros e estados de loading.
- Listagem de eventos públicos com odds estilizadas e data formatada.
- Seleção de odd e valor de aposta, com botões “Adicionar” (apostas múltiplas) e “Apostar Agora” (single bet).
- Checkout de apostas fixo na parte inferior: toggle, contagem de itens, remoção de apostas, total acumulado e aviso de saldo insuficiente.
- Página “Minhas Apostas” com histórico completo, filtros por status e data, total gasto e total de lucro.
- Cálculo e exibição de lucro individual (profit) e lucro total no histórico.
- Feedback visual de loading nas ações de login, registro, single bet e apostas múltiplas.
- Layout levemente responsivo usando Tailwind CSS e container centralizado.
- Roteamento público e protegido com React Router (páginas públicas de eventos, protegidas em `/my-bets`).

## 🧑‍💻 Como Executar

**Pré-requisitos**:
- Docker
- Docker Compose

**1. Variáveis de ambiente**
Crie um arquivo `.env` na raiz com as seguintes chaves:
```
MYSQL_ROOT_PASSWORD=SUASENHA
MYSQL_DATABASE=betting_app <-- Precisa ser exatamente esse nome!
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

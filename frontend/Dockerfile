# frontend/Dockerfile
FROM node:18-slim

WORKDIR /app

# Instala dependências de forma reprodutível
COPY package.json ./
RUN npm i

# Copia o resto do código
COPY . .

# Exponha a porta padrão do Vite
EXPOSE 5173

# Inicia o dev server escutando em todas as interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

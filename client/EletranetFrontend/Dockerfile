# Stage 1: Build
FROM node:20 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Define variável de ambiente para o build (passada como argumento)
ARG VITE_BACKEND_API
ENV VITE_BACKEND_API=$VITE_BACKEND_API

RUN npm run build

# Stage 2: Serve a build
FROM node:20-alpine

WORKDIR /app

# Instala um servidor estático simples
RUN npm install -g serve

# Copia a pasta da build para a imagem final
COPY --from=build /app/dist ./dist

EXPOSE 5173

# Serve os ficheiros estáticos na porta 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
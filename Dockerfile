# Etapa 1: Build
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instalar dependencias
RUN npm install -g pnpm && pnpm install

# Copiar el resto del código
COPY . .

# Compilar el proyecto
RUN pnpm build

# Etapa 2: Producción
FROM node:20-alpine AS runner

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Puerto expuesto
EXPOSE 3000

# Comando por defecto
CMD ["pnpm", "start"]

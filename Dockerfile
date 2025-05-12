# Estágio de build
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependências necessárias
RUN apk add --no-cache libc6-compat g++ make py3-pip python3

# Copia arquivos de configuração
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm ci

# Copia o restante dos arquivos
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Constrói o aplicativo
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instala apenas dependências de produção
COPY --from=build /app/package.json /app/package-lock.json* ./
RUN npm ci --only=production

# Copia os arquivos necessários do estágio de build
COPY --from=build /app/.output ./.output
COPY --from=build /app/server ./server
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Cria um script para executar as migrações e iniciar o app
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnode .output/server/index.mjs' > /app/start.sh && \
    chmod +x /app/start.sh

# Expõe a porta
EXPOSE 3000

# Configura o comando para iniciar o aplicativo
CMD ["/app/start.sh"]

# Estágio de build
FROM node:18-alpine AS build

WORKDIR /app

# Instala dependências necessárias e adiciona diagnóstico
RUN apk add --no-cache libc6-compat g++ make py3-pip python3 git curl && \
    node --version && \
    npm --version

# Configura o npm para ser mais resiliente
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copia arquivos de configuração
COPY package.json package-lock.json* ./

# Instala dependências com mais verbosidade
RUN npm ci --verbose || (cat /.npm/_logs/*-debug-0.log && exit 1)

# Copia o restante dos arquivos
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Constrói o aplicativo
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instala dependências necessárias
RUN apk add --no-cache libc6-compat git curl && \
    node --version && \
    npm --version

# Configura o npm para ser mais resiliente
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Instala apenas dependências de produção
COPY --from=build /app/package.json /app/package-lock.json* ./
RUN npm ci --only=production --no-audit --prefer-offline --verbose || (cat /.npm/_logs/*-debug-0.log && exit 1)

# Copia os arquivos necessários do estágio de build
COPY --from=build /app/.output ./.output
COPY --from=build /app/server ./server
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Cria um script para executar as migrações e iniciar o app
RUN echo '#!/bin/sh\n\
echo "Iniciando aplicação Nuxt..."\n\
echo "Node version: $(node --version)"\n\
echo "NPM version: $(npm --version)"\n\
echo "Conectando ao banco de dados: $DATABASE_URL"\n\
echo "Executando migrações Prisma..."\n\
npx prisma generate\n\
npx prisma migrate deploy\n\
echo "Iniciando servidor Nuxt..."\n\
node .output/server/index.mjs' > /app/start.sh && \
chmod +x /app/start.sh

# Expõe a porta
EXPOSE 3000

# Configura o comando para iniciar o aplicativo
CMD ["/app/start.sh"]

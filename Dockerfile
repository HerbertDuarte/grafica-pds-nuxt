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

# Copia arquivos de configuração e o esquema do Prisma
COPY package.json package-lock.json* ./
COPY server/prisma/schema.prisma ./server/prisma/schema.prisma

# Gera o cliente Prisma primeiro, antes de instalar todas as dependências
RUN npx prisma generate

# Instala dependências com mais verbosidade
RUN npm install --verbose

# Copia o restante dos arquivos depois da instalação das dependências
COPY . .

# Gera o cliente Prisma novamente (para garantir)
RUN cd /app && npx prisma generate

# Constrói o aplicativo
RUN cd /app && NODE_ENV=production npm run build

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

# Copia pasta prisma do build
COPY --from=build /app/server/prisma ./server/prisma

# Copia arquivos de configuração
COPY --from=build /app/package.json /app/package-lock.json* ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Copia os arquivos necessários do estágio de build
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Cria um script para executar as migrações e iniciar o app
RUN echo '#!/bin/sh\n\
echo "Iniciando aplicação Nuxt..."\n\
echo "Node version: $(node --version)"\n\
echo "NPM version: $(npm --version)"\n\
echo "Verificando localização do schema.prisma..."\n\
find / -name "schema.prisma" -type f 2>/dev/null || echo "Arquivo schema.prisma não encontrado"\n\
echo "Conectando ao banco de dados: $DATABASE_URL"\n\
echo "Executando migrações Prisma..."\n\
cd /app && npx prisma migrate deploy --schema=/app/server/prisma/schema.prisma\n\
echo "Iniciando servidor Nuxt..."\n\
node .output/server/index.mjs' > /app/start.sh && \
chmod +x /app/start.sh

# Expõe a porta
EXPOSE 3000

# Configura o comando para iniciar o aplicativo
CMD ["/app/start.sh"]

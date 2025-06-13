# Gráfica PDS

Documentação do nuxt: [clique aqui para acessar](https://nuxt.com/docs/getting-started/introduction).

## Setup

É preciso adicionar a variável de ambiente `DATABASE_URL` com a url de conexão do banco de dados Postgres num arquivo `.env` na raíz do projeto.

Se estiver com Docker instalado na sua máquina, poderá rodar o comando `docker compose up -d` e criar um container com uma instância de banco de dados Postgres totalmente compatível com a url de conexão dada no arquivo `.env.example`. Lembrando que ainda é necessário criar o arquivo `.env` que nesse caso será simplesmente uma cópia do `.env.example`.

Em seguida rode os seguintes comandos:

```bash
npm install # instalação das dependencias
npx prisma migrate dev # aplica as migrations no seu banco de dados (ddl)
npm run dev # roda o projeto na porta 3000 (http://localhost:3000) ou na próxima porta livre
```


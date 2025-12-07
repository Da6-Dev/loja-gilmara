# 🛍️ Loja Gilmara

Bem-vindo ao repositório da **Loja Gilmara**. Este é um projeto full-stack de e-commerce desenvolvido com as tecnologias mais modernas do ecossistema JavaScript/TypeScript, visando alta performance e escalabilidade.

## 🚀 Tecnologias Utilizadas

O projeto está organizado em uma estrutura de monorepo:

### Backend 🗄️
- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** TypeScript
- **Gerenciador de Pacotes:** npm

### Frontend 🎨
- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Linguagem:** TypeScript

---

## 📂 Estrutura do Projeto

```bash
loja-gilmara/
├── backend/    # API e lógica do servidor (NestJS)
└── frontend/   # Interface do usuário (React + Vite)
```

---

## 🛠️ Como Executar o Projeto

Para rodar o projeto localmente, você precisará de dois terminais abertos (um para o backend e outro para o frontend).

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado.

### 1. Configurando o Backend

No primeiro terminal:

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run start:dev
```

*O backend geralmente rodará em: `http://localhost:3000`*

### 2. Configurando o Frontend

No segundo terminal:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

*O frontend geralmente rodará em: `http://localhost:5173`*

---

## 🤝 Contribuição

1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b minha-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "Feature: Minha nova feature"`
4. Envie as suas alterações: `git push origin minha-feature`

---

## 📝 Licença

Este projeto está sob a licença MIT.
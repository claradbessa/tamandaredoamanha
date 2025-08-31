# Plataforma de Gestão - Projeto Tamandaré do Amanhã

![Status do Projeto](https://img.shields.io/badge/status-em%20manuten%C3%A7%C3%A3o-blue)
![Licença](https://img.shields.io/badge/license-MIT-green)
![PHP](https://img.shields.io/badge/PHP-8.3-8892BF?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql&logoColor=white)

![Capa do Projeto](https://res.cloudinary.com/dbr43jqca/image/upload/v1756556419/og-image-tamandare-do-amanha_-_Copia_texupb.png)

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades-principais">Funcionalidades</a> •
  <a href="#-arquitetura-e-tecnologias-utilizadas">Tecnologias</a> •
  <a href="#-demonstração-do-sistema-de-gestão">Demonstração</a> •
  <a href="#-como-executar-o-projeto-localmente">Como Executar</a> •
  <a href="#-principais-desafios-e-aprendizados">Desafios</a> •
  <a href="#-autora">Autora</a> •
  <a href="#-licença">Licença</a>
</p>

## 📖 Sobre o Projeto

Este projeto é uma **plataforma web full-stack** desenvolvida como Trabalho de Conclusão de Curso (TCC) e entregue para uso real pela ONG "Tamandaré do Amanhã" de Guaratinguetá-SP. A solução visa modernizar e otimizar a gestão interna da instituição e ampliar seu alcance na comunidade.

A aplicação é composta por duas partes principais:
* **Site Institucional Público:** Uma vitrine moderna e responsiva para apresentar o projeto, divulgar notícias, exibir uma galeria de fotos e captar doações e novos voluntários.
* **Painel Administrativo Robusto:** Um sistema de gestão completo para que os administradores e voluntários possam gerenciar alunos, aulas, frequência, postagens do blog e o conteúdo da galeria de fotos.

**Links:**
* **Site Institucional (Frontend):** `https://tamandaredoamanha.vercel.app/`
* **API (Backend):** `https://render-m7dj.onrender.com/`

---

## ✨ Funcionalidades Principais

### Painel Administrativo (Dashboard)
* **Autenticação Segura:** Sistema de login com tokens via Laravel Sanctum.
* **Gestão Completa (CRUD):** Módulos para gerenciar Alunos, Aulas, Voluntários, Postagens e Galeria.
* **Controle de Frequência:** Ferramenta para registrar a presença dos alunos e gerar relatórios.
* **Upload de Mídia na Nuvem:** Integração com **Cloudinary** para upload direto, garantindo performance e escalabilidade.
* **Dashboard Dinâmica:** Exibição de uma grade de horários em tempo real com as aulas da semana.

### Site Institucional (Público)
* **Design Totalmente Responsivo:** Interface adaptável para desktops, tablets e celulares.
* **Conteúdo Dinâmico:** Seções de Blog e Galeria alimentadas em tempo real pela API.
* **SEO Otimizado:** Implementação de meta tags e Open Graph com `react-helmet-async` para melhor indexação e compartilhamento em redes sociais.
* **Interatividade e UX:** Componentes como carrossel de imagens, lightbox para fotos e micro-interações.

---

## 🚀 Arquitetura e Tecnologias Utilizadas

A aplicação foi construída sobre uma arquitetura de serviços desacoplada, com um backend servindo uma API RESTful e um frontend SPA (Single Page Application) consumindo essa API.

### **Backend (API RESTful)**
* **Framework:** Laravel 12
* **Linguagem:** PHP 8.3
* **Banco de Dados:** PostgreSQL (hospedado na Supabase)
* **Autenticação:** Laravel Sanctum (Token-based)
* **Armazenamento de Mídia:** Cloudinary
* **Servidor de Produção:** Render (ambiente containerizado com Docker)
* **Monitoramento de Erros:** Sentry

### **Frontend (SPA)**
* **Framework:** React 18 com Vite
* **Linguagem:** JavaScript (JSX)
* **Roteamento:** React Router DOM
* **Comunicação com API:** Axios
* **Estilização:** CSS modular e Design System com variáveis CSS.
* **Hospedagem:** Vercel

### **Infraestrutura e DevOps**
* **Containerização:** Docker
* **CI/CD:** Deploy automatizado via integração com GitHub para Vercel e Render.

---

## 🎬 Demonstração do Sistema de Gestão

Veja abaixo algumas das principais funcionalidades do painel administrativo em ação.

### Home do Painel e Grade de Horários
A tela inicial exibe uma grade de horários dinâmica com as aulas da semana, oferecendo uma visão geral e imediata das atividades.

![Demonstração da Home do Painel Admin](https://res.cloudinary.com/dbr43jqca/image/upload/v1756597636/Tamandar%C3%A9_do_Amanh%C3%A3_-_Painel_admin.mp4_omqgse.gif)

### Gestão de Postagens do Blog
O sistema permite criar, editar e excluir postagens do blog de forma intuitiva, com upload de imagens integrado ao Cloudinary.

![Demonstração de Postagem no Blog](https://res.cloudinary.com/dbr43jqca/image/upload/v1756597635/Tamandar%C3%A9_do_Amanh%C3%A3_-_-_Post_dygtt1.gif)

### Cadastro de Alunos
Fluxo completo para adicionar novos alunos ao sistema, coletando todas as informações necessárias para a gestão da ONG.

![Demonstração do Cadastro de Alunos](https://res.cloudinary.com/dbr43jqca/image/upload/v1756597635/Tamandar%C3%A9_do_Amanh%C3%A3_-_Cadastro_de_alunos_mqrp1p.gif)

### Controle de Frequência
Ferramenta ágil para que os voluntários registrem a presença dos alunos em cada aula, facilitando o acompanhamento.

![Demonstração do Registro de Frequência](https://res.cloudinary.com/dbr43jqca/image/upload/v1756597636/Tamandar%C3%A9_do_Amanh%C3%A3_-_Registro_de_frequencia_zld9qs.gif)

---

## ⚙️ Como Executar o Projeto Localmente

### **Pré-requisitos**
* Git
* Node.js e npm (ou yarn)
* PHP 8.3 e Composer
* Docker (ou um ambiente de desenvolvimento PHP local como Herd/Laragon)
* Uma conta no Cloudinary e um banco de dados PostgreSQL (como o da Supabase)

### **Instalação**

```bash
# 1. Clone este repositório
git clone https://github.com/claradbessa/tamandaredoamanha

# 2. Navegue até a pasta do projeto
cd tamandaredoamanha
```

### **Backend ( API RESTful)**
```bash
# 1. Acesse a pasta do backend
cd backend

# 2. Copie o arquivo de ambiente de exemplo
cp .env.example .env

# 3. Preencha o arquivo .env com suas chaves do banco de dados,
# Cloudinary, Sentry, etc.

# 4. Instale as dependências do Composer
composer install

# 5. Gere a chave da aplicação Laravel
php artisan key:generate

# 6. Execute as migrações do banco de dados
php artisan migrate

# 7. Inicie o servidor de desenvolvimento
php artisan serve
```

### **Frontend (React)**
```bash
# 1. Em outro terminal, acesse a pasta do frontend
cd frontend

# 2. Copie o arquivo de ambiente de exemplo
cp .env.example .env

# 3. Edite o .env e aponte VITE_API_BASE_URL para a sua API local
# # Ex: VITE_API_BASE_URL=http://127.0.0.1:8000

# 4. Instale as dependências do Node.js
npm install

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

---

## 💡 Principais Desafios e Aprendizados

* **Depuração de Ambiente de Produção:** O maior desafio foi diagnosticar problemas complexos de configuração no ambiente de produção (Render), envolvendo cache do Laravel, limites de upload e a correta inicialização de serviços em Docker. A integração com **Sentry** foi fundamental para obter a visibilidade necessária.
* **Arquitetura de Upload de Arquivos:** A arquitetura foi refatorada para um modelo de **upload direto do cliente para o Cloudinary**, onde o backend apenas valida e salva as referências. Isso tornou o sistema mais rápido, escalável e resiliente a limitações de infraestrutura.
* **Construção de um Design System:** Foi criado um sistema de design do zero com variáveis CSS, garantindo uma identidade visual coesa e profissional tanto no site público quanto no painel administrativo.

---

## 👩‍💻 Autora

Este projeto foi desenvolvido com muito esforço, aprendizado e carinho por **Clara Bessa**.

* **LinkedIn:** [claradbessa](https://www.linkedin.com/in/claradbessa/)
* **Portfólio:** [claradbessa.vercel.app](https://claradbessa.vercel.app/)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

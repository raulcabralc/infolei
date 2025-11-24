# ⚖️ InfoLei - Democratizando o Acesso à Legislação Brasileira

> "Direito simples, sem fake news, na palma da mão."

![InfoLei Banner](https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200&h=400)

## 🇧🇷 O Desafio: Apatia e Desinformação

O Brasil vive um paradoxo: produzimos muitas leis, mas a população se sente cada vez mais distante do processo legislativo. Identificamos três barreiras críticas que alimentam esse cenário:

1.  **A Barreira do "Juridiquês":** A linguagem técnica dos textos oficiais torna o entendimento impossível para o cidadão comum.
2.  **O Vácuo de Informação:** Sem fontes acessíveis, o cidadão fica refém de *Fake News* ou simplesmente ignora seus novos direitos.
3.  **Irrelevância Percebida:** O cidadão não se engaja porque sente que "política não é para ele", recebendo informações genéricas que não impactam sua realidade imediata.

---

## 💡 A Solução: InfoLei e o Matching Inteligente

O **InfoLei** não é apenas um leitor de notícias jurídicas. É uma plataforma de **inteligência cívica** que conecta a base de dados da Câmara dos Deputados diretamente à vida do usuário.

### 🧠 O Grande Diferencial: Categorização e Matching via IA

Nosso sistema ataca a apatia através da **hiper-relevância**. Diferente de portais de notícias tradicionais, o InfoLei utiliza Inteligência Artificial em duas pontas:

1.  **No Processamento da Lei:** A IA lê o texto bruto do projeto de lei, classifica-o em categorias específicas (ex: Saúde, Tecnologia, Transporte) e gera uma "tradução" em linguagem natural.
2.  **No Perfil do Usuário:** A IA analisa a biografia do cidadão (ex: "Sou enfermeira e mãe solo") para identificar automaticamente suas tags de interesse.

**O Resultado:** O sistema cruza esses dados em tempo real. Quando uma lei relevante para "Saúde" é tramitada, o usuário "Enfermeira" é **notificado ativamente**. Isso garante que o cidadão receba apenas o que impacta sua profissão e vida, transformando ruído em engajamento.

---

## 📱 Funcionalidades Principais

-   **Tradução Jurídica:** Títulos populares e explicações simples (resumo e impactos) gerados por GPT-4o.
-   **Feed Personalizado:** Leis ordenadas pela relevância com o perfil do usuário.
-   **Perfil Inteligente:** O usuário pode escrever uma bio livre, e nossa IA define seus interesses automaticamente.
-   **Análise de Impacto:** Seção dedicada a explicar "Como isso muda sua vida" em tópicos práticos.
-   **Busca Semântica:** Encontre leis não apenas por palavras-chave, mas por contexto.

---

## 🚀 Stack Tecnológica

### Mobile (Frontend)
-   **React Native (Expo):** Desenvolvimento ágil e performance nativa.
-   **Expo Router:** Navegação moderna baseada em arquivos.
-   **Axios:** Camada de comunicação com a API.
-   **Google Fonts:** Identidade visual forte com Montserrat e Poppins.

### Backend (API)
-   **NestJS:** Arquitetura robusta e escalável em Node.js.
-   **MongoDB:** Flexibilidade para armazenar metadados complexos das leis.
-   **OpenAI API:** Motor de inteligência para tradução, classificação e matching.
-   **Cron Jobs:** Sincronização automática com a API de Dados Abertos.

---

## 📦 Como Rodar o Projeto (Mobile)

Este repositório contém o código do **Frontend Mobile**.

### Pré-requisitos
-   Node.js instalado.
-   App **Expo Go** no celular ou Emulador (Android/iOS).
-   Backend do InfoLei rodando.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/infolei-mobile.git](https://github.com/seu-usuario/infolei-mobile.git)
    cd infolei-mobile
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure a API:**
    Abra `src/services/api.ts` e insira o IP da sua máquina (se backend local):
    ```typescript
    export const api = axios.create({
      baseURL: 'http://SEU_IP_AQUI:3000', 
    });
    ```

4.  **Execute:**
    ```bash
    npx expo start
    ```

5.  **Acesse:**
    Escaneie o QR Code com o app **Expo Go**.

---

## 🤝 Contribuição

O InfoLei é um projeto de impacto social aberto. Pull Requests são bem-vindos para nos ajudar a conectar mais brasileiros aos seus direitos.

---

Feito com 💙 e tecnologia para a cidadania.

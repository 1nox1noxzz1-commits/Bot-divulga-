 Bot de Divulgação para Discord

[![Licença](https://shields.io)](LICENSE)
[![Discord](https://shields.io)](https://discord.gg)

Um bot do Discord poderoso e automatizado desenvolvido em JavaScript, focado em divulgação eficiente, gerenciamento de parcerias e crescimento de comunidades através de comandos modernos de barra (`/`).

##  Funcionalidades

*   **Divulgação Automatizada:** Envio de anúncios em canais parceiros configurados.
*   **Comandos Slash (/)**: Totalmente integrado com a nova API de comandos do Discord.
*   **Sistema de Parcerias:** Registro e verificação de servidores parceiros de forma simples.
*   **Filtro Anti-Spam:** Proteção integrada para evitar abusos no sistema de envio.
*   **Logs Detalhados:** Registro de todas as divulgações realizadas em um canal específico.

## 🛠️ Tecnologias Utilizadas

*   [Node.js](https://nodejs.org) (Ambiente de execução)
*   [Discord.js](https://js.org) (Biblioteca principal)
*   [JavaScript](https://mozilla.org) (Linguagem de programação)

## 📦 Instalação e Configuração

### Pré-requisitos
*   [Node.js](https://nodejs.org) v18.x ou superior instalado.
*   Token do bot criado no [Discord Developer Portal](https://discord.com).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com
   cd seu-repositorio
   ```

2. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie un arquivo chamado `.config.json` na raiz do projeto e adicione suas credenciais:
   ```config.json 
   token": "TOKEN DO SEU BOT",
  "ownerId": "SEU ID"
   ```

4. **Registre os comandos Slash:**
   *(Se o seu bot tiver um script separado para registrar os comandos)*
   ```bash
   node deploy-commands.js
   ```

5. **Inicie o bot:**
   ```bash
   node index.js
   ```

## ⚙️ Comandos Principais (/)

*   `/divulgar` - Envia a mensagem de divulgação nos servidores parceiros configurados.
*   `/configurar` - Configura o canal de anúncios ou logs do servidor.
*   `/parceria` - Mostra informações sobre como fechar parceria com o bot.
*   `/ping` - Verifica a latência atual do bot.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Veja o arquivo para mais detalhes.

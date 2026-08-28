const { REST, Routes } = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        // Pega o ID da aplicação automaticamente
        const appData = await rest.get(Routes.oauth2CurrentApplication());

        console.log(`Registrando comandos para app: ${appData.name} (${appData.id})`);

        // Registrar comandos globais (leva até 1h para atualizar) — ideal para testes use Routes.applicationGuildCommands(appData.id, GUILD_ID)
        await rest.put(
            Routes.applicationCommands(appData.id),
            { body: commands },
        );

        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
})();
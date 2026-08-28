const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.clear();
        console.log(`✅ Bot iniciado como ${client.user.tag}`);
        client.user.setPresence({
            activities: [{ name: 'Patho Store', type: ActivityType.Streaming, url: 'https://twitch.tv/seucanal' }],
            status: 'online'
        });
    }
};
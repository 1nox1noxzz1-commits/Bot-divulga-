const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  InteractionType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
  Client,
  GatewayIntentBits
} = require('discord.js');

const config = require('../config.json');

function validateInputs(token, serverId) {
  return token && serverId && !isNaN(serverId);
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Erro ao executar o comando.', ephemeral: true });
      }
    }

    // Abre seleção de opções
    else if (interaction.isButton() && interaction.customId === 'divulgar_button') {
      const rowEmbed = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('divulgar_embed')
          .setPlaceholder('Deseja usar embed?')
          .addOptions(
            { label: 'Sim', value: 'sim' },
            { label: 'Não', value: 'nao' }
          )
      );

      const rowButton = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('divulgar_botao')
          .setPlaceholder('Deseja usar botão?')
          .addOptions(
            { label: 'Sim', value: 'sim' },
            { label: 'Não', value: 'nao' }
          )
      );

      await interaction.reply({
        content: 'Escolha abaixo as opções de envio:',
        components: [rowEmbed, rowButton],
        ephemeral: true
      });
    }

    // Após escolha do select menu
    else if (interaction.isStringSelectMenu()) {
      const userId = interaction.user.id;

      if (!client._divulgarTemp) client._divulgarTemp = {};
      if (!client._divulgarTemp[userId]) client._divulgarTemp[userId] = {};

      if (interaction.customId === 'divulgar_embed') {
        client._divulgarTemp[userId].embed = interaction.values[0];
      } else if (interaction.customId === 'divulgar_botao') {
        client._divulgarTemp[userId].botao = interaction.values[0];
      }

      const { embed, botao } = client._divulgarTemp[userId];

      if (embed && botao) {
        const modal = new ModalBuilder()
          .setCustomId('divulgar_modal')
          .setTitle('Formulário de Divulgação');

        const tokenInput = new TextInputBuilder()
          .setCustomId('bot_token')
          .setLabel('Token do Bot')
          .setPlaceholder('Insira o TOKEN do bot aqui')
          .setStyle(TextInputStyle.Short);

        const serverIdInput = new TextInputBuilder()
          .setCustomId('server_id')
          .setLabel('ID do Servidor')
          .setPlaceholder('Insira o ID do servidor')
          .setStyle(TextInputStyle.Short);

        const messageInput = new TextInputBuilder()
          .setCustomId('message')
          .setLabel('Mensagem de Divulgação')
          .setPlaceholder('Insira a mensagem que será enviada')
          .setStyle(TextInputStyle.Paragraph);

        const components = [
          new ActionRowBuilder().addComponents(tokenInput),
          new ActionRowBuilder().addComponents(serverIdInput),
          new ActionRowBuilder().addComponents(messageInput)
        ];

        if (botao === 'sim') {
          const linkInput = new TextInputBuilder()
            .setCustomId('button_link')
            .setLabel('Link do botão')
            .setPlaceholder('https://seulink.com')
            .setStyle(TextInputStyle.Short);
          components.push(new ActionRowBuilder().addComponents(linkInput));
        }

        modal.addComponents(...components);

        await interaction.showModal(modal);
      } else {
        await interaction.deferUpdate();
      }
    }

    // Envio da mensagem via bot alvo
    else if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'divulgar_modal') {
      const token = interaction.fields.getTextInputValue('bot_token');
      const serverId = interaction.fields.getTextInputValue('server_id');
      const message = interaction.fields.getTextInputValue('message');
      const buttonLink = interaction.fields.fields.get('button_link')?.value || null;

      const userId = interaction.user.id;
      const user = interaction.user;
      const embedOption = client._divulgarTemp?.[userId]?.embed || 'nao';
      const botaoOption = client._divulgarTemp?.[userId]?.botao || 'nao';

      delete client._divulgarTemp?.[userId]; // limpar

      if (!validateInputs(token, serverId)) {
        await interaction.reply({ content: 'Erro: Insira um token válido e um ID de servidor.', ephemeral: true });
        return;
      }

      await interaction.reply({ content: 'As informações foram recebidas. O bot será configurado em instantes!', ephemeral: true });

      try {
        const targetBot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

        targetBot.once('ready', async () => {
          console.log(`Bot alvo conectado como ${targetBot.user.tag}`);

          const targetGuild = targetBot.guilds.cache.get(serverId);
          if (!targetGuild) {
            console.error('Servidor não encontrado.');
            await user.send("Erro: Servidor não encontrado. Verifique o ID do servidor.");
            return;
          }

          let sentMessages = 0;
          let failedMessages = 0;

          const reportEmbed = new EmbedBuilder()
            .setTitle('Relatório de Divulgação')
            .setColor(0x00FF00)
            .addFields(
              { name: 'Mensagens Enviadas', value: `${sentMessages}`, inline: true },
              { name: 'Mensagens com Falha', value: `${failedMessages}`, inline: true }
            )
            .setFooter({ text: 'Obrigado por usar o Painel de Divulgação!' });

          const reportMessage = await user.send({ embeds: [reportEmbed] });

          const members = await targetGuild.members.fetch();
          for (const member of members.values()) {
            if (!member.user.bot) {
              try {
                let payload = {};

                if (embedOption === 'sim') {
                  const embedMsg = new EmbedBuilder()
                    .setDescription(message)
                    .setColor(0x0099ff);

                  payload.embeds = [embedMsg];
                } else {
                  payload.content = message;
                }

                if (botaoOption === 'sim' && buttonLink && buttonLink.startsWith('http')) {
                  const button = new ButtonBuilder()
                    .setLabel('Clique aqui')
                    .setStyle(ButtonStyle.Link)
                    .setURL(buttonLink);

                  payload.components = [new ActionRowBuilder().addComponents(button)];
                }

                await member.send(payload);
                sentMessages++;
              } catch {
                failedMessages++;
              }

              reportEmbed.setFields(
                { name: 'Mensagens Enviadas', value: `${sentMessages}`, inline: true },
                { name: 'Mensagens com Falha', value: `${failedMessages}`, inline: true }
              );

              await reportMessage.edit({ embeds: [reportEmbed] });
              await new Promise(res => setTimeout(res, 100));
            }
          }

          targetBot.destroy();
        });

        await targetBot.login(token);
      } catch (error) {
        console.error('Erro ao conectar com o bot alvo:', error);
        await user.send("Erro: Não foi possível conectar ao bot alvo.");
      }
    }
  }
};

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('divulgar')
    .setDescription('Abre o painel de divulgação (visível apenas para você)'),
  async execute(interaction) {
    // Mensagem de verificação temporária
    await interaction.reply({
      content: '<a:emoji_2:1400720395090395187> Verificando suas permissões...',
      ephemeral: true
    });

    // Espera 4 segundos
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Verifica permissões
    if (interaction.user.id !== config.ownerId) {
      return interaction.editReply({
        content: '<:emoji_3:1400721877063700582> Você não tem permissão para usar este comando.',
        ephemeral: true
      });
    }

    // Criação do embed
    const embed = new EmbedBuilder()
      .setTitle('Formulário de Divulgação')
      .setDescription('Clique em <:emoji_4:1400723175007850518> Divulgar e preencha as informações necessárias. O bot enviará mensagens privadas aos membros do servidor.')
      .setImage('https://cdn.discordapp.com/attachments/1328882106402603018/1328882417985130506/1734574275-banner.png')
      .setFooter({
        text: 'Todos os direitos reservados',
        iconURL: 'https://cdn.discordapp.com/icons/1311194808475455488/a_541dfd94ff4651af45d9b4bc1c7a12eb.gif?size=2048'
      });

    // Botões
    const divulgarButton = new ButtonBuilder()
  .setCustomId('divulgar_button')
  .setLabel('Divulgar')
  .setEmoji('1400723175007850518') // <- Aqui é o ID do emoji personalizado
  .setStyle(ButtonStyle.Secondary);

    const tutorialButton = new ButtonBuilder()
      .setLabel('📺 Veja o Tutorial')
      .setURL('https://www.youtube.com/watch?v=MYmYRXbAb3Y')
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(divulgarButton, tutorialButton);

    // Edita a mensagem original com o embed e os botões
    await interaction.editReply({
      content: '',
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescriptionLocalizations({
      de: 'Sendet die Eingabe zurück'
    })
    .setDescription('Replies with the input')
    .addStringOption(option =>
      option.setName('input')
        .setNameLocalizations({
          de: 'eingabe'
        })
        .setDescriptionLocalizations({
          de: 'Die Eingabe'
        })
        .setDescription('Your input')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.reply(interaction.options.getString('input'));
  }
}
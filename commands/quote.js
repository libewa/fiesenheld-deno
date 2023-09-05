const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Generates a random quote.'),
  async execute(interaction) {
    const response = await fetch('https://zenquotes.io/api/random');
    const [data] = await response.json();
    await interaction.reply(`${data.q}\n- ${data.a}\nSource: https://zenquotes.io`);
  },
};
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription('Returns the latest news from the Tagesschau homepage.')
    .setDescriptionLocalizations({
      de: 'Die neuesten Nachrichten, direkt von der Tagesschau-Website.'
    })
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('The index of the element to show')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(10)),
  async execute(interaction) {
    const index = interaction.options.getInteger('index')
    const response = await fetch('https://www.tagesschau.de/api2/homepage');
    const data = await response.json();
    const article = data.news[index];
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(article.title)
      .setThumbnail(article.teaserImage.klein1x1.imageurl)
      .setURL(article.detailsweb)
      .setDescription(article.firstSentence)
      .setFooter({ text: 'Source: tagesschau.de', iconURL: 'https://www.tagesschau.de/favicon.ico' })
    await interaction.reply({ embeds: [embed] });
  },
};
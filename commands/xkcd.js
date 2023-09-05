process.noDeprecation = true
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const cheerio = require('cheerio')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription('Fetches XKCD comics')
    .addSubcommand(subcommand =>
      subcommand
        .setName('random')
        .setDescription('Return a random XKCD'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('latest')
        .setDescription('The latest XKCD comic'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('number')
        .setDescription('A comic with a specific number')
        .addIntegerOption(option =>
          option.setName('i')
            .setDescription('The index of the comic you want')
            .setRequired(true))),
  async execute(interaction) {
    var pageUrl = ``
    if (interaction.options.getSubcommand() === 'random') {
      pageUrl = `https://c.xkcd.com/random/comic/`;
    } else if (interaction.options.getSubcommand() === 'latest') {
      pageUrl = `https://xkcd.com`
    } else if (interaction.options.getSubcommand() === 'number') {
      pageUrl = `https://xkcd.com/${interaction.options.getInteger('i')}`
    }
    const pageResponse = await fetch(pageUrl);
    if (!pageResponse.ok) {
      interaction.reply({ content: `xkcd.com returned a non-2xx status code. ${`Most probably the requested comic number ${interaction.options.getInteger('i')} does not exist.`}`, ephemeral: true })
      return
    }
    const pageText = await pageResponse.text();
    const $ = cheerio.load(pageText);
    const permalink = $('#middleContainer > a:first').attr('href')
    const cTitle = $('#ctitle').text();
    const imageUrl = $('#middleContainer > a:last').attr('href')
    //console.log(imageUrl, cTitle, permalink)
    const embed = new EmbedBuilder()
      .setTitle(cTitle)
      .setURL(permalink)
      .setFooter({ text: 'XKCD: A webcomic of romance, sarcasm, math, and language.', iconURL: 'https://www.explainxkcd.com/wiki/images/1/1f/xkcd_favicon.png' })
      .setImage(imageUrl)
    await interaction.reply({ embeds: [embed] });
  }
}
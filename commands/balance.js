const { SlashCommandBuilder } = require('@discordjs/builders');
const Database = require("@replit/database")
const db = new Database()
module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('View your balance')
    .setDescriptionLocalizations({
      de: 'Schau auf dein Bankkonto'
    }),
  async execute(interaction) {
    const user = interaction.user.id
    console.log(user)
    db.get(user).then(wallet => {
      if (wallet != null) {
        interaction.reply(`You have \`${wallet.money}\` money`)
      } else {
        interaction.reply('You do not have a wallet yet. Run </work:1092699880956379186> to create one.')
      }
    })
  },
};
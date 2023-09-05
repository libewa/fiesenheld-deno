const { SlashCommandBuilder } = require('@discordjs/builders');
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  cooldown: 3600,
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work for some money'),
  async execute(interaction) {
    const user = interaction.user.id
    db.get(user).then(wallet => {
      if (wallet != null) {
        earn = Math.floor(Math.random() * 20)
        newMoney = wallet.money + earn
        db.set(`${user}`, { money: newMoney, items: wallet.items })
        interaction.reply(`You earned \`${earn}\` money`)
      } else {
        db.set(`${user}`, { money: 100, items: [] })
        interaction.reply('Your wallet has been created and you have been given `100` money.')
      }
    })
  },
};
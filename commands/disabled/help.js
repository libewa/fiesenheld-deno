const { SlashCommandBuilder } = require('discord.js');

const msg = `
**Use**
fiesenheld currently has no use but for me to try discord.js
**Commands**
</ping:1050870798421864548>: The ping
</echo:1081236533115355257>: Replies with the input
</help:1081274223022047283>: Shows this help
`

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get some help'),
	async execute(interaction) {
		await interaction.reply(msg);
	},
};
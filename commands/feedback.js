const { SlashCommandBuilder } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [] });
const token = process.env['token']
module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Send feedback to the dev')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('The feedback you want to provide')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('anonymous')
                .setDescription('Whether to include your name in the feedback')
                .setRequired(false)),
    async execute(interaction) {
        client.login(token)
        const content = interaction.options.getString('content')
        const anon = interaction.options.getBoolean('anonymous')
        const user = anon ? 'An anonymous user' : interaction.user
        const linus = await client.users.fetch("840499419626995742")
        linus.send(`${user} has provided feedback:\n${content}`)
        interaction.reply({ content: 'Your feedback has been sent', ephemeral: true })
    },
};
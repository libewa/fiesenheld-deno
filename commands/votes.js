const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Ask chat to vote')
    .addSubcommand(subcommand =>
      subcommand
        .setName('yes-no')
        .setDescription('To be or not to be, that\'s the question.')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('Your question for chat to vote on.')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('options')
        .setDescription('Provide 2-4 options to choose between.')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('The question to choose an answer to.')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('one')
            .setDescription('The first possible answer')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('two')
            .setDescription('The second possible answer')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('three')
            .setDescription('The third possible answer')
            .setRequired(false))
        .addStringOption(option =>
          option.setName('four')
            .setDescription('The fourth possible answer')
            .setRequired(false))),
  async execute(interaction) {
    const command = interaction.options.getSubcommand()
    var question = interaction.options.getString('question')
    const user = await interaction.user.fetch(true)
    var elements = []
    var embed;
    if (command === 'yes-no') {
      const yes = new ButtonBuilder()
        .setCustomId('option1')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✅')
      const no = new ButtonBuilder()
        .setCustomId('option2')
        .setLabel('No')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('❎')
      embed = new EmbedBuilder()
        .setTitle(`A new vote by ${user.tag}!`)
        .setDescription(question)
        .addFields(
          { name: "This vote will expire", value: `<t:${Math.round(Date.now()/1000+900)}:R>`, inline: true},
          { name: 'Yes', value: `0 votes` ,inline: false},
          { name: 'No', value: `0 votes` , inline: false}
        )
      elements = [yes, no]
    } else if (command === 'options') {
      const one = interaction.options.getString('one')
      const two = interaction.options.getString('two')
      const three = interaction.options.getString('three')
      const four = interaction.options.getString('four')
      const option1 = new ButtonBuilder()
        .setCustomId('option1')
        .setLabel("Option 1")
        .setStyle(ButtonStyle.Primary);
      const option2 = new ButtonBuilder()
        .setCustomId('option2')
        .setLabel("Option 2")
        .setStyle(ButtonStyle.Primary);
      elements = [option1, option2]
      if (three != null) {
        const option3 = new ButtonBuilder()
          .setCustomId('option3')
          .setLabel("Option 3")
          .setStyle(ButtonStyle.Primary);
        elements.push(option3)
      }
      if (four != null) {
        const option4 = new ButtonBuilder()
          .setCustomId('option4')
          .setLabel("Option 4")
          .setStyle(ButtonStyle.Primary);
        elements.push(option4)
      }
      embed = new EmbedBuilder()
        .setTitle(`A new vote by ${user.tag}!`)
        .setDescription(question)
        .addFields(
          { name: "This vote will expire", value: `<t:${Math.round(Date.now()/1000+900)}:R>`, inline: true},
          { name: one, value: `0 votes`, inline: false },
          { name: two, value: `0 votes`, inline: false }
        )
      if (three != null) {
        embed.addFields({ name: three, value: `0 votes`, inline: false })
      }
      if (four != null) {
        embed.addFields({ name: four, value: `0 votes`, inline: false })
      }
    }

    const row = new ActionRowBuilder()
      .addComponents(elements)
    const response = await interaction.reply({ components: [row], embeds: [embed] })
    const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });
    var votes = {
      one: 0,
      two: 0,
      three: 0,
      four: 0
    }
    var voters = []
    collector.on('collect', async i => {
      if (!voters.includes(i.user.id)) {
        voters.push(i.user.id)
        const selection = i.customId;
        switch (selection) {
          case 'option1':
            votes.one += 1
            break;
          case 'option2':
            votes.two += 1
            break;
          case 'option3':
            votes.three += 1
            break;
          case 'option4':
            votes.four += 1
          default:
            interaction.followUp('something went wrong')
            break;
        }
        if (command === 'yes-no') {
          embed.data.fields[1].value = `${votes.one} votes`
          embed.data.fields[2].value = `${votes.two} votes`
        } else {
          embed.data.fields[1].value = `${votes.one} votes`
          embed.data.fields[2].value = `${votes.two} votes`
          if (three != null) {
            embed.data.fields[3].value = `${votes.three} votes`
          }
          if (four != null) {
            embed.data.fields[4].value = `${votes.four} votes`
          }
        }
        await i.deferUpdate()
        await response.edit({ components: [row], embeds: [embed] })
      } else {
        i.reply({ content: 'You already voted on this topic', ephemeral: true })
      }
    });
  }
}
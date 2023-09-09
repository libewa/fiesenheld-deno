import { require } from "https://deno.land/x/require/mod.ts"

const token = Deno.env.get('token')

Deno.serve(
  { port: 3000, hostname: "0.0.0.0" },
  (_req) => new Response("Trust me, I'm still alive. Now visit https://discord.com/api/oauth2/authorize?client_id=1049397374952419368&permissions=380171769856&scope=bot%20applications.commands to try me out!")
);

// register command

import { REST, Routes, Collection, ActivityType, Client, GatewayIntentBits } from 'npm:discord.js'
const { nowPlaying, status, activity, afk } = require('./config.json')
import _keep_alive from './keep_alive.js'

console.log(token)

import fs from 'node:fs'
import path from 'node:path'
const rest = new REST({ version: '10' }).setToken(token);

// wait for interaction
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Import commands from ./commands/
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
client.cooldowns = new Collection()
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}



client.on('ready', () => {
  switch (activity) {
    case 'playing':
      client.user.setActivity(nowPlaying, ActivityType.Playing)
      break;
    case 'competing':
      client.user.setActivity(nowPlaying, ActivityType.Competing)
      break;
    case 'watching':
      client.user.setActivity(nowPlaying, ActivityType.Watching)
      break;
    case 'listening':
      client.user.setActivity(nowPlaying, ActivityType.Listening)
      break;
    case 'custom':
      client.user.setActivity(nowPlaying, ActivityType.Custom)
    default:
      break;
  }
  client.user.setStatus(status);
  client.user.setAFK(afk)
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  const { cooldowns } = client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({ content: `Please wait <t:${expiredTimestamp}:R> more second(s) before reusing the \`${command.data.name}\` command.`, ephemeral: true });
    }
  }
  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// login

client.login(token);

require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Sett dette til navnet på welcome-kanalen din
const WELCOME_CHANNEL_NAME = 'velkommen';

// Sett dette til navnet på rollen Carl-bot IKKE skal gi,
// hvis du vil at DIN bot skal gi rollen i stedet
const AUTO_ROLE_NAME = 'Medlem';

// Endre disse tekstene som du vil
const SERVER_IP = 'fivem://CONNECT-IP-HER';
const RULES_TEXT =
  'Les reglene nøye før du spiller. Ingen trolling, ingen VDM/RDM, og bruk sunn fornuft.';
const WHITELIST_TEXT =
  'For whitelist: gå til søknadskanalen og bruk Appy for å sende inn søknad.';
const WELCOME_TEXT =
  'Velkommen {member} til Nordic RP 👋\nLes reglene og søk whitelist for å få full tilgang.';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

async function registerCommands() {
  if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.log('Mangler CLIENT_ID eller GUILD_ID i .env, hopper over slash commands.');
    return;
  }

  const commands = [
    new SlashCommandBuilder()
      .setName('hei')
      .setDescription('Boten sier hei'),

    new SlashCommandBuilder()
      .setName('ip')
      .setDescription('Viser server-IP'),

    new SlashCommandBuilder()
      .setName('regler')
      .setDescription('Viser regler'),

    new SlashCommandBuilder()
      .setName('whitelist')
      .setDescription('Forklarer hvordan whitelist fungerer')
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registrert.');
  } catch (error) {
    console.error('Kunne ikke registrere slash commands:', error);
  }
}

client.once('ready', async () => {
  console.log(`Nordic RP Bot er online som ${client.user.tag}`);
  await registerCommands();
});

client.on('guildMemberAdd', async member => {
  try {
    // Welcome-kanal
    const welcomeChannel = member.guild.channels.cache.find(
      c => c.name === WELCOME_CHANNEL_NAME && c.isTextBased()
    );

if (welcomeChannel) {
  const embed = new EmbedBuilder()
    .setColor('#2b6cb0')
    .setAuthor({ name: 'Nordic RP' })
    .setTitle('Velkommen til Nordic RP 👋')
    .setDescription(`Velkommen ${member}!\n\n👥 Du er medlem #${member.guild.memberCount}\n\n📜 Les reglene\n📝 Søk whitelist\n\nVelkommen til Nordic RP 🌌`)
    .setThumbnail('https://cdn.discordapp.com/attachments/1489012596739805366/1490655663951446116/Nordic_winter_landscape_with_aurora.png')
    .setFooter({ text: 'Nordic RP • Norge RP Server' })
    .setTimestamp();

  await welcomeChannel.send({ embeds: [embed] });
} else {
  console.log(`Fant ikke kanalen "${WELCOME_CHANNEL_NAME}"`);
}

    // Auto role
    const autoRole = member.guild.roles.cache.find(
      role => role.name === AUTO_ROLE_NAME
    );

    if (autoRole) {
      await member.roles.add(autoRole);
      console.log(`Ga rollen "${AUTO_ROLE_NAME}" til ${member.user.tag}`);
    } else {
      console.log(`Fant ikke rollen "${AUTO_ROLE_NAME}"`);
    }
  } catch (error) {
    console.error('Feil ved join:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'hei') {
      await interaction.reply(`Hei ${interaction.user} 👋 Velkommen til Nordic RP.`);
    }

    if (interaction.commandName === 'ip') {
      await interaction.reply(`Server-IP: ${SERVER_IP}`);
    }

    if (interaction.commandName === 'regler') {
      await interaction.reply({
        content: RULES_TEXT,
        ephemeral: true
      });
    }

    if (interaction.commandName === 'whitelist') {
      await interaction.reply({
        content: WHITELIST_TEXT,
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('Feil ved slash command:', error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'Noe gikk feil.',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'Noe gikk feil.',
        ephemeral: true
      });
    }
  }
});

const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Nordic RP Bot is running');
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Web server kjører på port ${PORT}`);
});

client.login(TOKEN);

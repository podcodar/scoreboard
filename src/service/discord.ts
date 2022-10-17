import { BOT_ID, DAILY_CHANNEL, DISCORD_TOKEN } from "#/constants";
import {
  Client,
  GatewayIntentBits,
  Interaction,
  Message,
  REST,
  Routes,
} from "discord.js";
import { makeScoreboardContent, computeDaily } from "./daily-scoreboard";

const commands = [
  {
    name: "scoreboard",
    description: "Get the scoreboard of the month",
  },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

export async function connectToDiscord() {
  // setup bot commands
  await addCommands();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("messageCreate", messageHandler);
  client.on("messageUpdate", (_prev, next) =>
    messageHandler(next as Message<boolean>)
  );

  client.on("interactionCreate", interactionHandler);

  return client.login(DISCORD_TOKEN);
}

async function addCommands() {
  console.log("Started refreshing application (/) commands.");
  await rest.put(Routes.applicationCommands(BOT_ID), { body: commands });
  console.log("Successfully reloaded application (/) commands.");
}

async function messageHandler(msg: Message) {
  const isDailyChannel = msg.channelId === DAILY_CHANNEL;
  if (!isDailyChannel) return;

  const dailyWords = ["o que eu fiz", "o que vou fazer"];
  const isDailyMessage = dailyWords.every((word) =>
    msg.content.toLowerCase().includes(word)
  );
  if (!isDailyMessage) return;

  const { username } = msg.author;
  console.log("adding daily record for:", { username });
  await computeDaily(username);
}

async function interactionHandler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "scoreboard") {
    const content = await makeScoreboardContent(10);
    await interaction.reply(content);
  }
}

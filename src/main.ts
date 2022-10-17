import { connectToDiscord as startDiscordBot } from "./service/discord";

async function main() {
  await startDiscordBot();
  console.log("bot connected");
}

main();

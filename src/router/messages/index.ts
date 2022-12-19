import { App } from "@slack/bolt";
import { sendMessageToLogChannel, sleep } from "../../utils";

export default function handleMessages(app: App) {
  app.message("Hi", async ({ say, client }) => {
    await sendMessageToLogChannel("Log message", client);
    await sleep(3000);
    await say("Hello there!");
  });
}

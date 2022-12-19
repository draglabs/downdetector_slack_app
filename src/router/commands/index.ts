import { App } from "@slack/bolt";
import { SlashCommands } from "../../constants";
import { addSite, checkIfSiteRegistered, listSites } from "../../firebase";
import { replyMessage, replyPrivateMessage } from "../../utils";

export default function handleActions(app: App) {
  app.command(SlashCommands.LIST, async ({ body, ack }) => {
    await ack();
    const sites = await listSites();
    let message = "Registered sites:";
    sites.forEach((site) => {
      message += `\n\t${site.url}`;
    });
    replyMessage({
      app: app,
      botToken: process.env.SLACK_BOT_TOKEN,
      channelId: body.channel_id,
      threadTimestamp: body.ts,
      message: message,
    });
  });

  app.command(SlashCommands.REGISTER, async ({ body, ack, say }) => {
    await ack();

    try {
      new URL(body.text);
    } catch (error) {
      await say(`Error registering, '${body.text}' is not a valid url`);
      return;
    }
    let isRegistered: boolean = true;
    try {
      isRegistered = await checkIfSiteRegistered(body.text);
      if (isRegistered) {
        await say(`Site ${body.text} is already registered`);
        return;
      }
      await addSite(body.text, body.channel_id);
      await say(`Site ${body.text} registered successfully`);
    } catch (error) {
      await say(`Error registering ${body.text}, ${error}`);
    }
  });
}

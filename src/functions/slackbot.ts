import { App, ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import { APIGatewayEvent, Context } from "aws-lambda";
import * as dotenv from "dotenv";
import {
  IHandlerResponse,
  ISlackPrivateReply,
  ISlackReactionReply,
  ISlackReply,
  SlashCommands,
} from "../constants";
import { addSite, checkIfSiteRegistered, listSites } from "../firebase";
import {
  generateReceiverEvent,
  isUrlVerificationRequest,
  parseRequestBody,
  replyMessage,
  replyPrivateMessage,
  replyReaction,
} from "../utils";

dotenv.config();

const expressReceiver: ExpressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true,
});

const app: App = new App({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  token: `${process.env.SLACK_BOT_TOKEN}`,
  receiver: expressReceiver,
});

app.message(async ({ message }) => {
  const reactionPacket: ISlackReactionReply = {
    app: app,
    botToken: process.env.SLACK_BOT_TOKEN,
    channelId: message.channel,
    threadTimestamp: message.ts,
    reaction: "robot_face",
  };
  await replyReaction(reactionPacket);

  const messagePacket: ISlackReply = {
    app: app,
    botToken: process.env.SLACK_BOT_TOKEN,
    channelId: message.channel,
    threadTimestamp: message.ts,
    message: "Hello :wave:",
  };
  await replyMessage(messagePacket);
});

app.command(SlashCommands.LIST, async ({ body, ack }) => {
  ack();
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
app.command(SlashCommands.REGISTER, async ({ body, ack }) => {
  ack();

  try {
    new URL(body.text);
  } catch (error) {
    return await replyPrivateMessage({
      app: app,
      botToken: process.env.SLACK_BOT_TOKEN,
      channelId: body.channel_id,
      userId: body.user_id,
      message: `Error registering, '${body.text}' is not a valid url`,
    });
  }
  let isRegistered: boolean = true;
  try {
    isRegistered = await checkIfSiteRegistered(body.text);
    if (isRegistered) {
      return await replyPrivateMessage({
        app: app,
        botToken: process.env.SLACK_BOT_TOKEN,
        channelId: body.channel_id,
        userId: body.user_id,
        message: `Site ${body.text} is already registered`,
      });
    }
    await addSite(body.text, body.channel_id);
    await replyPrivateMessage({
      app: app,
      botToken: process.env.SLACK_BOT_TOKEN,
      channelId: body.channel_id,
      userId: body.user_id,
      message: `Site ${body.text} registered successfully`,
    });
  } catch (error) {
    return await replyPrivateMessage({
      app: app,
      botToken: process.env.SLACK_BOT_TOKEN,
      channelId: body.channel_id,
      userId: body.user_id,
      message: `Error registering ${body.text}, ${error}`,
    });
  }
});

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<IHandlerResponse> {
  const payload: any = parseRequestBody(
    event.body,
    event.headers["content-type"]
  );

  if (isUrlVerificationRequest(payload)) {
    return {
      statusCode: 200,
      body: payload?.challenge,
    };
  }

  const slackEvent: ReceiverEvent = generateReceiverEvent(payload);
  await app.processEvent(slackEvent);

  return {
    statusCode: 200,
    body: "",
  };
}

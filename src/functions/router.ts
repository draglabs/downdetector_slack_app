import { App, ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import { APIGatewayEvent, Context } from "aws-lambda";
import * as dotenv from "dotenv";
import { IHandlerResponse } from "../constants";
import {
  generateReceiverEvent,
  isUrlVerificationRequest,
  parseRequestBody,
} from "../utils";

dotenv.config();

const SLACK_BOT_ENDPOINT =
  process.env.SLACK_BOT_ENDPOINT ||
  "http://localhost:8888/.netlify/functions/slackbot";

const expressReceiver: ExpressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true,
});

const app: App = new App({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  token: `${process.env.SLACK_BOT_TOKEN}`,
  receiver: expressReceiver,
});

app.message(async ({ say }) => {
  await say("Processing...");
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

  try {
    fetch(SLACK_BOT_ENDPOINT, {
      body: event.body,
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 200,
    body: "",
  };
}

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

function assembleUrl(event: any) {
  if (process.env.URL) {
    return process.env.URL;
  }
  return `http://${event.headers.host}`;
}
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
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
  fetch(`${assembleUrl(event)}/.netlify/functions/slackbot`, {
    body: event.body,
    method: "POST",
    headers: event.headers as any,
  }).catch((err) => console.error(err));
  await sleep(1000);

  return {
    statusCode: 200,
    body: "",
  };
}

import { App, ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import { APIGatewayEvent, Context } from "aws-lambda";
import * as dotenv from "dotenv";
import { IHandlerResponse } from "../constants";
import {
  assembleUrl,
  generateReceiverEvent,
  isUrlVerificationRequest,
  parseRequestBody,
  sleep,
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

// app.message(async ({ say }) => {
//   await say("Processing...");
// });

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
  fetch(`${assembleUrl(event)}/.netlify/functions/router`, {
    body: event.body,
    method: "POST",
    headers: {
      "Content-Type": event.headers["content-type"] || "application/json",
    },
  }).catch((err) => console.error(err));
  await sleep(1000);

  return {
    statusCode: 200,
    body: "",
  };
}

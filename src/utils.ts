import { ReceiverEvent } from "@slack/bolt";
import {
  ISlackPrivateReply,
  ISlackReactionReply,
  ISlackReply,
} from "./constants";
import { View } from "@slack/bolt";
import {
  WebClient,
  ViewsUpdateResponse,
  ViewsPublishResponse,
} from "@slack/web-api";

export function parseRequestBody(
  stringBody: string | null,
  contentType: string | undefined
): any | undefined {
  try {
    if (!stringBody) {
      return "";
    }

    let result: any = {};

    if (contentType && contentType === "application/json") {
      return JSON.parse(stringBody);
    }

    let keyValuePairs: string[] = stringBody.split("&");
    keyValuePairs.forEach(function (pair: string): void {
      let individualKeyValuePair: string[] = pair.split("=");
      result[individualKeyValuePair[0]] = decodeURIComponent(
        individualKeyValuePair[1] || ""
      );
    });
    result = JSON.parse(JSON.stringify(result));
    if (result.payload) {
      return JSON.parse(JSON.stringify(JSON.parse(result.payload)));
    }
    return result;
  } catch {
    return "";
  }
}

export function generateReceiverEvent(payload: any): ReceiverEvent {
  return {
    body: payload,
    ack: async (response): Promise<any> => {
      return {
        statusCode: 200,
        body: response ?? "",
      };
    },
  };
}

export function isUrlVerificationRequest(payload: any): boolean {
  if (payload && payload.type && payload.type === "url_verification") {
    return true;
  }
  return false;
}

export async function replyMessage(messagePacket: ISlackReply): Promise<void> {
  try {
    await messagePacket.app.client.chat.postMessage({
      token: messagePacket.botToken,
      channel: messagePacket.channelId,
      thread_ts: messagePacket.threadTimestamp,
      text: messagePacket.message,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function replyReaction(
  reactionPacket: ISlackReactionReply
): Promise<void> {
  try {
    await reactionPacket.app.client.reactions.add({
      token: reactionPacket.botToken,
      name: reactionPacket.reaction,
      channel: reactionPacket.channelId,
      timestamp: reactionPacket.threadTimestamp,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function replyPrivateMessage(
  messagePacket: ISlackPrivateReply
): Promise<void> {
  try {
    await messagePacket.app.client.chat.postEphemeral({
      token: messagePacket.botToken,
      channel: messagePacket.channelId,
      text: messagePacket.message,
      user: messagePacket.userId,
    });
  } catch (error) {
    console.error(error);
  }
}

export function assembleUrl(event: any) {
  if (process.env.URL) {
    return process.env.URL;
  }
  return `http://${event.headers.host}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function updateOrPublishView(
  client: WebClient,
  view: View,
  viewId?: string,
  user_id?: string
): Promise<ViewsUpdateResponse | ViewsPublishResponse | void> {
  try {
    if (viewId) {
      await client.views.update({
        view_id: viewId,
        view: view,
      });
    } else if (user_id) {
      await client.views.publish({
        user_id: user_id,
        view: view,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function sendMessageToLogChannel(
  message: string,
  client: WebClient
) {
  const channels = await client.conversations.list();
  const channel = channels.channels?.find(
    (ch) => ch.name === process.env.SLACK_LOG_CHANNEL || "downdetector"
  );
  if (channel && channel.id) {
    try {
      return await client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: channel.id,
        text: message,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

import {
  App,
  Middleware,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { listSites } from "../../firebase";
import { updateOrPublishView } from "../../utils";
import Home from "../../views/home";
import List from "../../views/list";
import Register from "../../views/register";

type IActionHandler = Middleware<
  SlackActionMiddlewareArgs<SlackAction>,
  StringIndexed
>;

const homeActionHandler: IActionHandler = async ({ ack, client, body }) => {
  await ack();
  try {
    await client.views.publish({
      user_id: body.user.id,
      view: Home({ userId: body.user.id }),
    });
  } catch (error) {
    console.error(error);
    // await say("An error occurred while setting up the home tab");
  }
};

const listActionHandler: IActionHandler = async ({ ack, client, body }) => {
  await ack();
  const sites = await listSites();
  let ubody: any = body;

  updateOrPublishView(
    client,
    List({ sites }),
    ubody?.view?.id || ubody?.container?.view_id,
    body.user.id
  );
};

const reigsterActionHandler: IActionHandler = async ({ ack, client, body }) => {
  await ack();
  try {
    await client.views.publish({
      user_id: body.user.id,
      view: Register({}),
    });
  } catch (error) {
    console.error(error);
  }
};

const registerConfirmActionHandler: IActionHandler = async ({ ack, body }) => {
  await ack();
  const ubody: any = body;
  const values = ubody?.view?.state?.values;

  const url = (values["site-url"] ?? {})["site-url-value"];
  console.log(url);
};

export default function handleActions(app: App) {
  app.action("home-action", homeActionHandler);
  app.action("list-action", listActionHandler);
  app.action("register-action", reigsterActionHandler);
  app.action("register-confirm-action", registerConfirmActionHandler);
}

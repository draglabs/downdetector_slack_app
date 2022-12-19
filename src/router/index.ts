import { App } from "@slack/bolt";
import handleActions from "./actions";
import handleCommands from "./commands";
import handleEvents from "./events";
import handleMessages from "./messages";

export default function eventRoutes(app: App) {
  handleMessages(app);
  handleCommands(app);
  handleActions(app);
  handleEvents(app);
}

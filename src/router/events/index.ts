import { App } from "@slack/bolt";
import Home from "../../views/home";

export default function handleEvents(app: App) {
  app.event("app_home_opened", async ({ payload, client }) => {
    const userId = payload.user;
    try {
      await client.views.publish({
        user_id: userId,
        view: Home({ userId }),
      });
    } catch (error) {
      console.error(error);
    }
  });
}

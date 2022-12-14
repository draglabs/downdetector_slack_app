import { ViewFunction } from "./types";

type Props = {};

const Home: ViewFunction<Props> = () => {
  return {
    // Home tabs must be enabled in your app configuration page under "App Home"
    type: "home",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Welcome to Downdetector :house_with_garden:",
        },
      },
      {
        type: "divider",
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "List sites",
              emoji: true,
            },
            action_id: "list-action",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Reister site",
              emoji: true,
            },
            action_id: "register-action",
          },
        ],
      },
    ],
  };
};

export default Home;

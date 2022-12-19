import { ViewFunction, Blocks } from "./types";

export const HomeBlocks: Blocks = [
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
];

const Home: ViewFunction<{}> = () => {
  return {
    type: "home",
    blocks: HomeBlocks,
  };
};

export default Home;

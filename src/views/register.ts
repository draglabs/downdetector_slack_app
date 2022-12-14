import Home from "./home";
import { ViewFunction } from "./types";

type Props = {
  urls: string[];
};

const Register: ViewFunction<Props> = ({ urls }) => {
  const home = Home({});
  return {
    ...home,
    blocks: [
      ...home.blocks,
      {
        type: "input",
        block_id: "site-url",
        label: {
          type: "plain_text",
          text: "Site url",
        },
        element: {
          type: "plain_text_input",
          action_id: "site-url-value",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            style: "primary",
            text: {
              type: "plain_text",
              text: "Save",
              emoji: true,
            },
            action_id: "register-action-confirm",
          },
        ],
      },
    ],
  };
};

export default Register;

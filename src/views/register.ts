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
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Register a site to monitor.*",
        },
      },
    ],
  };
};

export default Register;

import Home from "./home";
import { ViewFunction } from "./types";
import { extendView } from "./utils";

type Props = {
  sites: {
    url: string;
    channelId: string;
  }[];
};

const List: ViewFunction<Props> = ({ sites }) => {
  const urlsText = sites
    .map((site) => `*\t• ${site.url}* on ${site.channelId}`)
    .join("\n");

  const home = Home({});
  return extendView(home, {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Here are your registered URLs:\n${urlsText}`,
    },
  });
};

export default List;

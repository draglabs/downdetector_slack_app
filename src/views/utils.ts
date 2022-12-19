import { View } from "@slack/bolt";
import { Blocks, KBlock } from "./types";

export function composeBlocks(...blocks: Blocks[]) {
  return blocks.flat();
}

export function composeViews(...views: View[]) {
  const blocks = views.map((view) => view.blocks);
  return {
    ...views[0],
    blocks: composeBlocks(...blocks),
  };
}

export function extendView(view: View, ...blocks: KBlock[]) {
  return {
    ...view,
    blocks: composeBlocks(view.blocks, ...[blocks]),
  };
}

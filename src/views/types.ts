import { Block, KnownBlock, View } from "@slack/bolt";

export type ViewFunction<T> = (props: T) => View;

export type KBlock = KnownBlock | Block;

export type Blocks = KBlock[];

export type ViewTypes = "home" | "modal" | "workflow_step";

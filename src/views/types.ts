import { View } from "@slack/bolt";

export type ViewFunction<T> = (props: T) => View;

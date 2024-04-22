import { SavedPCData } from "./system-types";

export type HandleModifyPlayerFunc = (
  index: number,
  player: SavedPCData,
  action: "add" | "update" | "delete"
) => void;

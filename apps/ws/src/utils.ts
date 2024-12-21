import { GAME_TYPE } from "./message";

export function returnsTime(game_type: GAME_TYPE): number {
  switch (game_type) {
    case "CLASSICAL":
      return 10 * 60 * 1000;
    case "BLITZ":
      return 3 * 60 * 1000;
    case "RAPID":
      return 5 * 60 * 1000;
    case "BULLET":
      return 1 * 60 * 1000;
    default:
      return 20 * 60 * 1000;
  }
}

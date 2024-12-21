export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export type GAME_STATUS =
  | "PLAYER_EXIT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP";

export function returnsTime(game_type: string): number {
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

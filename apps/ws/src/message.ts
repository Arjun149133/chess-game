export const INIT_GAME = "init_game";
export const GAME_ADDED = "game_added";
export const MOVE = "move";
export const GAME_TIME_MS = 1 * 60 * 1000;
export const GAME_ALERT = "game_alert";
export const GAME_ENDED = "game_ended";
export const EXIT_GAME = "exit_game";
export const PLAYER_TIME = "player_time";
export const IN_PROGRESS = "in_progress";

export const JOIN_ROOM = "join_room";
export const GAME_NOT_FOUND = "game_not_found";
export const GAME_JOINED = "game_joined";

export enum GAME_TYPE {
  CLASSICAL = "CLASSICAL",
  BLITZ = "BLITZ",
  RAPID = "RAPID",
  BULLET = "BULLET",
}

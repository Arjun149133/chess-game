export interface MoveType {
  id: string;
  gameId: string;
  from: string;
  to: string;
  comment: string | null;
  timeTaken: number | null;
  createdAt: Date;
  promotion?: string;
}

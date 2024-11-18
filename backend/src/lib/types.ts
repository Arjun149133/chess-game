export interface jwtClaims {
  username: string;
  userId: string;
  isGuest: boolean;
}

export interface UserDetails {
  id: string;
  username: string;
  token?: string;
  isGuest?: boolean;
  picture?: string;
}

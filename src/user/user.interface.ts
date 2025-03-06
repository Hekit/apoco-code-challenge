export interface AuthenticatedUser {
  _id: number;
  username: string;
}

export interface UserFavoritesResponse {
  favorites: number[];
  username: string;
}

export interface User {
  _id: number;
  username: string;
  password: string;
  favorites: number[];
}

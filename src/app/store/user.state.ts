import { UserData } from './user.model';

export interface UserState {
  user: UserData | null;
}

export const initialState: UserState = {
  user: null,
};
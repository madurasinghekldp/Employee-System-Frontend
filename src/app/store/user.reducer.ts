import { createReducer, on } from '@ngrx/store';
import { initialState } from './user.state';
import { loadUser, clearUser } from './user.actions';

export const userReducer = createReducer(
  initialState,
  on(loadUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(clearUser, state => ({
    ...state,
    user: null,
  }))
);
import { createAction, props } from '@ngrx/store';
import { UserData } from './user.model';

export const loadUser = createAction(
  '[User] Load User',
  props<{ user: UserData }>()
);

export const clearUser = createAction('[User] Clear User');
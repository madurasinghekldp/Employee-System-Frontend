import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserData } from "./user.model"

type UserState = {
    user: UserData|null;
}

const initialState: UserState = {
    user: null
}

export const userStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store) => ({
            loadUsers(data:UserData|null){
                patchState(store, {user: data});
            }
        })
    )
)
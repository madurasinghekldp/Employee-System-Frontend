import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserData } from "./user.model"

type UserState = {
    user: UserData|null;
    roles: string[]|null;
}

const initialState: UserState = {
    user: null,
    roles:[]
}

export const userStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store) => ({
            loadUsers(data:UserData|null){
                patchState(store, {user: data});
            },
            loadRoles(data:string[]|null){
                patchState(store, {roles: data});
            }
        })
    )
)
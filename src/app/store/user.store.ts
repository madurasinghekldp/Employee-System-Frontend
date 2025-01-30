import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserData } from "./user.model"
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";
import { isErrorResponse, isSuccessResponse } from "../utility/response-type-check";
import { HttpClient } from "@angular/common/http";

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
                console.log(data);
            }
        })
    )
)
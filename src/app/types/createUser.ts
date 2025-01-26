import { Company } from "./company";

export type CreateUser = {
    firstName:string|null;
    lastName:string|null;
    email:string|null;
    password:string|null;
    userRoleName:string|null;
    company:Company|null;
}
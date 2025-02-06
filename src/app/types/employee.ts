import { Company } from "./company";
import { Department } from "./department";
import { Role } from "./role";

export type Employee = {
    id: number|null;
    firstName: string|null;
    lastName: string|null;
    email: string|null;
    department: Department|null;
    role: Role|null;
    company: Company|undefined;
}
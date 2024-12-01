import { Department } from "./department";
import { Role } from "./role";

export type Employee = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: Department;
    role: Role;
}
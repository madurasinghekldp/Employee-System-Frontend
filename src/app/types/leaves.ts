import { Employee } from "./employee";
import { User } from "./user";

export type Leaves = {
    id: number|null;
    employee: Employee|null;
    startDate: string|null;
    endDate: string|null;
    approvedBy: User|null;
}
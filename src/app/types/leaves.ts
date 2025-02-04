import { Employee } from "./employee";

export type Leaves = {
    id: number|null;
    employee: Employee|null;
    startDate: string|null;
    endDate: string|null;
}
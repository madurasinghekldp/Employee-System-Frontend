import { Employee } from "./employee";
import { User } from "./user";

export type Leaves = {
    id: number|null;
    date: string|null;
    reason: string|null;
    leaveType: string|null;
    dayCount: number|null;
    approvedBy: User|null;
}
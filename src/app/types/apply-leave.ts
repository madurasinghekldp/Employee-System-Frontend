import { User } from "./user";

export type LeaveCreate = {
    id: number|null;
    user: User|null;
    date: string|null;
    reason: string|null;
    leaveType: string|null;
    dayCount: number|null;
}
import { User } from "./user";

export type LeaveCreate = {
    id: number|null;
    user: User|null;
    startDate: string|null;
    endDate: string|null;
}
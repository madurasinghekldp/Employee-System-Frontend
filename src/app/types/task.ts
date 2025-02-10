import { Employee } from "./employee";

export type Task = {
    id:number|null;
    employee:Employee|null;
    taskName:string|null;
    startDate:string|null;
    dueDate:string|null;
    completedDate:string|null;
    overDues:number|null;
}
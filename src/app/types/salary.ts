import { Employee } from "./employee"

export type Salary = {
    id: number|null,
    employee: Employee|null,
    payment: number|null,
    paymentDate: string|null
  }
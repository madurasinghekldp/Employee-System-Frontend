export type Company = {
    id: number|null;
    name: string;
    address: string;
    registerNumber: string;
  }
  
  export type UserData = {
    id: number|null;
    firstName: string;
    lastName: string;
    email: string;
    company: Company;
  }
  
  export interface UserResponse {
    status: string;
    data: UserData;
  }
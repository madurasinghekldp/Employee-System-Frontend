export interface Company {
    id: number;
    name: string;
    address: string;
    registerNumber: string;
  }
  
  export interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    company: Company;
  }
  
  export interface UserResponse {
    status: string;
    data: UserData;
  }
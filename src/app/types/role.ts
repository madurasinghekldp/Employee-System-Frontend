import { Company } from "./company";

export type Role = {
    id: number|null;
    name: string|null;
    description: string|null;
    company: Company|undefined;
}
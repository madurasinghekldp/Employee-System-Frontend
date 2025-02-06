import { Company } from "./company";

export type Department = {
    id: number|null;
    name: string|null;
    description: string|null;
    company: Company|undefined;
}
import { IBeer } from "./beer";

export interface ITap{
    id: number;
    order: number;
    beerId: number;
    beer: IBeer;
}
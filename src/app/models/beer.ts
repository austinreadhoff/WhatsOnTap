import { IStyle } from "./style";

export interface IBeer{
    id: number;
    name: string;
    styleId: number;
    style: IStyle;
    abv: number;
    ibu: number;
    og: number;
    fg: number;
    srm: number;
    description: string;
    label: string;
    labelSrc: string;
}
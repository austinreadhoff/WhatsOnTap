import { IStyle } from "./style";
import { ILabel } from "./label";

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
    labelId: number;
    label: ILabel;
    labelSrc: string;
}
import { ILabel } from "../models/label";

export class Global {
    public static BASE_BEER_ENDPOINT = 'api/beer';
    public static BASE_TAP_ENDPOINT = 'api/tap';
    public static BASE_STYLE_ENDPOINT = 'api/style';
    public static BASE_SETTING_ENDPOINT = 'api/setting';
    public static BASE_LABEL_ENDPOINT = 'api/label';

    public static getLabelSrc(label:ILabel): string {
        if (label){
            return `data:image/${label.extension};base64,${label.image}`;
        }
        else{
            return null;
        }
    }
}
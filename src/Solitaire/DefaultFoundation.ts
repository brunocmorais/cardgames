import { Card } from "../Common/Model/Card";
import { Foundation } from "../Common/Model/Foundation";

export class DefaultFoundation extends Foundation {
    
    validate(foundation: Card[], card: Card): boolean {
        return true;
    }

}
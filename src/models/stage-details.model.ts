import { Object, Property } from 'fabric-contract-api';
import { TextValidator } from '../decorators';

@Object()
export abstract class StageDetails {
 
    @Property() public RecordID: string;
    @Property() @TextValidator({ allowTrailingSpaces: false, allowLeadingSpaces: false, minimumLength: 6, maximumLength: 15 }) public PONumber: string

}
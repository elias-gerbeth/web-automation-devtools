import { CrxRequestType } from './request-types.enum';

export interface CrxRequestMessage {
    id: string;
    type: CrxRequestType;
    payload: any;
    isRequest: boolean;
}

import { CrxBroadcastToWebAppType, CrxBroadCastToContentScriptType } from './broadcast-types.enum';

export interface CrxBroadcastMessageForContentScript extends CrxBroadcastMessage {
    type: CrxBroadCastToContentScriptType;
    isForContentScript: boolean;
}

export interface CrxBroadcastMessageForWebApp extends CrxBroadcastMessage {
    type: CrxBroadcastToWebAppType;
    isForWebApp: boolean;
}

interface CrxBroadcastMessage {
    payload: any;
    isBroadcast: boolean;
    isError?: boolean;
    errorMessage: string;
}

export interface CrxRequestResponseMessage {
    id: string;
    payload: any;
    isRequestResponseMessage: boolean;
    isCompleted: boolean;
    isError?: boolean;
    errorMessage?: string;
}

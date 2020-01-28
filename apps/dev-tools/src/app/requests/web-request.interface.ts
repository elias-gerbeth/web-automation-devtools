export interface WebRequestHeader {
    name: string;
    value: string;
}
export interface WebRequestQueryStringParam {
    name: string;
    value: string;
}
export interface WebRequestCookie {
    domain: string;
    expires: any;
    httpOnly: boolean;
    name: string;
    path: string;
    secure: boolean;
    value: string;
}

export interface WebRequest {
    method: string;
    url: string;
    request: {
        headers: WebRequestHeader[];
        cookies: WebRequestCookie[];
        queryStringParams: WebRequestQueryStringParam[];
        body?: string;
        bodyMimeType?: string;
    }
    response: {
        status: number;
        headers: WebRequestHeader[];
        cookies: WebRequestCookie[];
        mimeType: string;
        body?: string;
        redirectURL?: string;
    }
}
/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { CrxMsgClientService } from '@crx-messaging';
import { WebRequest } from './web-request.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestsService {

    constructor(
        private crx: CrxMsgClientService
    ) {
        this.recordRequests();
    }

    recordRequests() {
        chrome.devtools.network.onRequestFinished.addListener(async (req: any) => {
            var res = req.response;
            if (res.status < 200 ||
                res.status >= 300 ||
                !res.content
            ) {
                return;
            }
            const responseBody: string = await new Promise<string>(r => req.getContent(r));
            // req.response.content.body = content;
            const request: WebRequest = {
                method: req.request.method,
                url: req.request.url,
                request: {
                    headers: req.request.headers,
                    cookies: req.request.cookies,
                    queryStringParams: req.request.queryString,
                    body: req.request.postData ? req.request.postData.text : '',
                    bodyMimeType: req.request.postData ? req.request.postData.mimeType : '',
                },
                response: {
                    status: res.status,
                    cookies: res.cookies,
                    headers: res.headers,
                    mimeType: res.content ? res.content.mimeType : '',
                    body: responseBody,
                    redirectURL: res.redirectURL,
                }
            };
            console.log('request: ', request);
            await this.save(request);
        });
    }

    getAllObservable() {
        return new Observable<WebRequest[]>(subscribe => {
            chrome.storage.onChanged.addListener(async (changes, areaName) => {
                if (areaName === 'local') {
                    subscribe.next(changes.requests.newValue);
                }
            });
        });
    }

    async getByIndex(index: number) {
        const requests = await this.getAllSnapshot();
        return requests[index];
    }

    async getAllSnapshot() {
        const obj = await new Promise<any>(r => chrome.storage.local.get('requests', r));
        return obj.requests;
    }

    async save(request: WebRequest) {
        let requests: WebRequest[] = await this.getAllSnapshot();
        if (!requests) {
            requests = [];
        }
        requests.push(request);
        await new Promise(r => chrome.storage.local.set({ requests }, r));
    }

    async clear() {
        await new Promise(r => chrome.storage.local.clear(r));
    }
}

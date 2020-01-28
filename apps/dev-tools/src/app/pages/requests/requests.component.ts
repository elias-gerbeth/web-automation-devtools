import { Component, OnInit } from '@angular/core';
import { WebRequest } from '../../requests/web-request.interface';
import { NzMessageService } from 'ng-zorro-antd';
import { CrxMsgClientService } from '@crx-messaging';
import { RequestsService } from '../../requests/requests.service';

interface RequestListItem {
    id: number;
    title: string;
}

@Component({
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {
    requests: RequestListItem[] = [];

    constructor(
        private msg: NzMessageService,
        private crx: CrxMsgClientService,
        private requestService: RequestsService,
    ) {
        this.requestService.getAllObservable().subscribe(requests => {
            this.requests = requests.map((request, index) => {
                return {
                    id: index,
                    title: request.method + ' ' + request.url,
                } as RequestListItem;
            });
        });
    }

    async log(request: RequestListItem) {
        const reqAtIndex = await this.requestService.getByIndex(request.id);
        console.log('logging request: ', reqAtIndex, 'at index', request.id);
        const selectedTab = await new Promise<chrome.tabs.Tab>(r => chrome.tabs.getSelected(r));
        if (selectedTab) {
            const code = `var str = ${JSON.stringify(JSON.stringify(reqAtIndex))};var obj = JSON.parse(str);console.log('LOG REQUEST: (Web Automation DevTools): ', obj)`;
            console.log(code);
            chrome.tabs.executeScript({ code });
        }
    }

    async clear() {
        await this.requestService.clear();
    }
}

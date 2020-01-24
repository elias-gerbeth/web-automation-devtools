import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CrxMsgClientService, CrxRequestType } from '@crx-messaging';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

    initLoading = true; // bug
    loadingMore = false;
    data: any[] = [];
    list: Array<{ loading: boolean; name: any }> = [];

    constructor(
        private msg: NzMessageService,
        private crx: CrxMsgClientService,
    ) { }

    ngOnInit(): void {
        this.getData((res: any) => {
            this.data = res.results;
            this.list = res.results;
            this.initLoading = false;
        });
    }

    getData(callback: (res: any) => void): void {
        // this.crx.request(CrxRequestType.loadLatest, null).subscribe((res: any) => callback(res));
    }

    onLoadMore(): void {
        // this.loadingMore = true;
        // this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
        // this.http.get(fakeDataUrl).subscribe((res: any) => {
        //     this.data = this.data.concat(res.results);
        //     this.list = [...this.data];
        //     this.loadingMore = false;
        // });
    }

    edit(item: any): void {
        this.msg.success(item.email);
    }

}

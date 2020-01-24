import { Component, OnInit } from '@angular/core';
import { CrxMsgClientService, CrxRequestType } from '@crx-messaging';
import { WalmartAtcInputData } from '@arbitrage-fulfillment-crx/backend/walmart';

@Component({
    selector: 'arbitrage-fulfillment-crx-testing',
    templateUrl: './testing.component.html',
    styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

    url = 'https://www.walmart.com/ip/Walker-Edison-Wood-TV-Stand-for-TV-s-up-to-56-Black/15612530';

    loading = false;
    constructor(
        private crx: CrxMsgClientService,
    ) { }

    ngOnInit() {
    }

    addToCart() {
        this.loading = true;
        const payload: WalmartAtcInputData = {
            itemUrl: this.url,
            quantity: 1,
        };
        this.crx.request(CrxRequestType.walmartATC, payload).subscribe(result => {
            this.loading = false;
            console.log(result);
        });
    }

    login() {
        this.loading = true;
        this.crx.request(CrxRequestType.walmartLogin, null).subscribe(result => {
            this.loading = false;
            console.log(result);
        });
    }

    setShippingAddress() {
        this.loading = true;
        this.crx.request(CrxRequestType.walmartSetShipAddress, null).subscribe(result => {
        this.loading = false;
            console.log(result);
        });
    }

}

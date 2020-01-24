import { Component } from '@angular/core';
import { CrxMessageServiceBackground, CrxRequestType } from '@crx-messaging';
import { WalmartService, WalmartLoginInput } from '@arbitrage-fulfillment-crx/backend/walmart';
import { Settings } from '@shared/interfaces';

@Component({
    selector: 'arbitrage-fulfillment-crx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private crx: CrxMessageServiceBackground,
        private walmartService: WalmartService,
    ) {
        crx.requestHandlerFor(CrxRequestType.loadSettings, payload => {
            const str = localStorage.getItem('setings');
            return str ? JSON.parse(str) : null;
        });
        crx.requestHandlerFor(CrxRequestType.saveSettings, payload => {
            localStorage.setItem('setings', JSON.stringify(payload));
        });

        crx.requestHandlerFor(CrxRequestType.walmartATC, async payload => {
            return await this.walmartService.addToCart(payload);
        });

        crx.requestHandlerFor(CrxRequestType.walmartSetShipAddress, async payload => {
            return await this.walmartService.setShippingAddress();
        });

        crx.requestHandlerFor(CrxRequestType.walmartLogin, async () => {
            const settings: Settings = JSON.parse(localStorage.getItem('setings'));
            const payload: WalmartLoginInput = {
                email: settings.walmartLogin,
                password: settings.walmartPassword,
            };
            return await this.walmartService.login(payload);
        });
    }
}

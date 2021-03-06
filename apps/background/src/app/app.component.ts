import { Component } from '@angular/core';
import { CrxMessageServiceBackground, CrxRequestType } from '@crx-messaging';

@Component({
    selector: 'web-automation-dev-tools-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private crx: CrxMessageServiceBackground,
    ) {
    }
}

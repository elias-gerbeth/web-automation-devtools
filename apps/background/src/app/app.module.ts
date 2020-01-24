import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CrxMessageBackgroundModule } from '@crx-messaging';
import { AppComponent } from './app.component';
import { BackendWalmartModule } from '@arbitrage-fulfillment-crx/backend/walmart';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        CrxMessageBackgroundModule,
        BackendWalmartModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

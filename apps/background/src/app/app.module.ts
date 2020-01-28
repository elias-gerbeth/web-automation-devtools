import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CrxMessageBackgroundModule } from '@crx-messaging';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        CrxMessageBackgroundModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

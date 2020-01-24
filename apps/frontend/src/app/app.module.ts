import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedDataAccessCrxMessageClientModule } from '@crx-messaging';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { SettingsComponent } from './pages/settings/settings.component';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './+state/app.state';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, SettingsComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedDataAccessCrxMessageClientModule,
        AppRoutingModule,
        IconsProviderModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([AppState]),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        NgxsLoggerPluginModule.forRoot(),
        // NgxsCrxClientStorePluginModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

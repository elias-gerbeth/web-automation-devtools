import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedDataAccessCrxMessageClientModule } from '@crx-messaging';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { IconsProviderModule } from './icons-provider.module';
import { RequestsComponent } from './pages/requests/requests.component';
import { TabsComponent } from './pages/tabs/tabs.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

registerLocaleData(en);

@NgModule({
    declarations: [AppComponent, RequestsComponent, WelcomeComponent, TabsComponent, ModalFormComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(AppRoutes, { initialNavigation: 'enabled', useHash: true }),
        FormsModule,
        ReactiveFormsModule,
        SharedDataAccessCrxMessageClientModule,
        IconsProviderModule,
        NgZorroAntdModule,
        DragDropModule,
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

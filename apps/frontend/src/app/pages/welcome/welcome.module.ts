import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { WelcomeComponent } from './welcome.component';
const routes: Routes = [
    { path: '', component: WelcomeComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NgZorroAntdModule,
    ],
    declarations: [WelcomeComponent],
    exports: [WelcomeComponent]
})
export class WelcomeModule { }

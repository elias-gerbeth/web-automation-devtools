import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { GlobalState } from './+state/app.state';

@NgModule({
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            GlobalState,
        ])
    ]
})
export class SharedStateModule { }

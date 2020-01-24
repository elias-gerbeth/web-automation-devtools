import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestingRoutingModule } from './testing-routing.module';
import { TestingComponent } from './testing.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TestingComponent],
  imports: [
    CommonModule,
    FormsModule,
    TestingRoutingModule,
    NgZorroAntdModule,
  ]
})
export class TestingModule { }

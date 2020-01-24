import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CrxMessageServiceBackground } from './crx-message-background/crx-msg-background.service';

@NgModule({
  imports: [CommonModule],
  providers: [CrxMessageServiceBackground],
  // exports: [CrxMessageServiceBackground],
})
export class CrxMessageBackgroundModule { }

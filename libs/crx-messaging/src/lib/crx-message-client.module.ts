import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CrxMsgClientService } from './crx-message-client/crx-msg-client.service';

@NgModule({
  imports: [CommonModule],
  providers: [CrxMsgClientService],
  // exports: [CrxMsgClientService],
})
export class SharedDataAccessCrxMessageClientModule { }

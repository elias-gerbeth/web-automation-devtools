/// <reference types="chrome"/>
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CrxMsgClientService, CrxRequestType } from '@crx-messaging';
import { RequestsService } from '../../requests/requests.service';
import { WebRequest } from '../../requests/web-request.interface';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

    constructor() { }

}

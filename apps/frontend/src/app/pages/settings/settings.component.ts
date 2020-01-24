import { Component, OnInit } from '@angular/core';
import { CrxMsgClientService, CrxRequestType } from '@crx-messaging';
import { Settings } from '@shared/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { tap } from 'rxjs/operators';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    settings: Settings;

    saving = false;
    form: FormGroup;
    constructor(
        private crx: CrxMsgClientService,
        private fb: FormBuilder,
        private msg: NzMessageService,
    ) {
        this.form = fb.group({
            walmartLogin: ['', [Validators.required]],
            walmartPassword: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.crx.request(CrxRequestType.loadSettings, null).subscribe((settings: Settings) => {
            this.settings = settings;
            this.form.setValue(settings);
        });
    }

    saveSettings() {
        this.saving = true;
        const settings: Settings = {
            walmartLogin: this.form.value.walmartLogin,
            walmartPassword: this.form.value.walmartPassword,
        };
        this.crx.request(CrxRequestType.saveSettings, settings).subscribe(result => {
            this.saving = false;
            this.msg.success('Settings saved');
        });
    }
}

import { Inject, Injectable } from '@angular/core';
import { NgxsPlugin } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { NgxsCrxStorePluginOptions, NGXS_CRX_STORE_PLUGIN_OPTIONS } from './crx-store.options.di-token';

@Injectable()
export class NgxsCrxStoreClientPlugin implements NgxsPlugin {
    constructor(@Inject(NGXS_CRX_STORE_PLUGIN_OPTIONS) private options: NgxsCrxStorePluginOptions) { }

    handle(state, action, next) {
        console.log('Action started!', state, action);
        return next(state, action).pipe(
            tap(result => {
                console.log('Action happened!', result);
            })
        );
    }
}

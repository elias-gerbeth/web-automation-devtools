import { ModuleWithProviders, NgModule } from '@angular/core';
import { NGXS_PLUGINS } from '@ngxs/store';
import { NGXS_CRX_STORE_PLUGIN_OPTIONS } from './crx-store.options.di-token';
import { NgxsCrxStoreClientPlugin } from './crx-store-client.plugin';

@NgModule()
export class NgxsCrxClientStorePluginModule {
    static forRoot(config?: any): ModuleWithProviders {
        return {
            ngModule: NgxsCrxClientStorePluginModule,
            providers: [
                {
                    provide: NGXS_PLUGINS,
                    useClass: NgxsCrxStoreClientPlugin,
                    multi: true
                },
                {
                    provide: NGXS_CRX_STORE_PLUGIN_OPTIONS,
                    useValue: config
                }
            ]
        };
    }
}

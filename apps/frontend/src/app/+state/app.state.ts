import { State, Action, StateContext } from '@ngxs/store';
import { AppStateModel } from './app.model';
import { LoadSettingsAction } from './app.actions';
import { CrxMsgClientService, CrxRequestType } from '@crx-messaging';
import { tap } from 'rxjs/operators';

@State<AppStateModel>({
    name: 'app',
    defaults: {
        test: null,
    }
})
export class AppState {

    constructor(
        private crx: CrxMsgClientService,
    ) { }

    @Action(LoadSettingsAction)
    loadSettings(ctx: StateContext<AppStateModel>) {
        // return this.crx.request(CrxRequestType.helloWorld, null).pipe(tap(result =>
        //     ctx.patchState({
        //         ...result,
        //     })
        // ));
    }
}

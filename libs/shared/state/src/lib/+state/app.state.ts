import { CrxMsgClientService, CrxRequestType } from '@crx-messaging';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { LoadSettingsAction } from './app.actions';
import { AppStateModel as GlobalStateModel } from './app.model';

@State<GlobalStateModel>({
    name: 'app',
    defaults: {
        test: null,
    }
})
export class GlobalState {

    constructor(
        private crx: CrxMsgClientService,
    ) { }

    @Action(LoadSettingsAction)
    loadSettings(ctx: StateContext<GlobalStateModel>) {
        // return this.crx.request(CrxRequestType.helloWorld, null).pipe(tap(result =>
        //     ctx.patchState({
        //         ...result,
        //     })
        // ));
    }
}

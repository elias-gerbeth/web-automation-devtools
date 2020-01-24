import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadSettingsAction } from './+state/app.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isCollapsed = false;

    constructor(
        // private store: Store,
    ) {
        // this.store.dispatch(LoadSettingsAction);
    }
}

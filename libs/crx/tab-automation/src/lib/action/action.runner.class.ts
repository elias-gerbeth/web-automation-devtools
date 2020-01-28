import { TabAction } from './action.class';
import { ChromeTab } from '../tab/tab.class';

export class TabActionRunner {

    private isPaused = false;
    private stopped = false;

    constructor(
        private actions: TabAction[],
    ) { }

    public async run() {
        console.log('CREATE TAB AND AWAIT LOADING: ');
        const tab = await ChromeTab.createEmptyBackgroundTab();
        console.log('TAB CREATED! TAB ID:', tab.getTabId());
        for (const action of this.actions) {
            console.log('RUN ACTION: ', action.toJson());
            try {
                await action.run(tab);
            } catch (err) {
                console.log('ACTION ERROR: ', err.message, ' the action was: ', action.toJson());
                throw err;
            }
            console.log('ACTION COMPLETED!');
            if (this.isPaused) {
                console.log('PAUSED');
                while (this.isPaused) {
                    await new Promise(r => setTimeout(r, 100));
                    if (this.stopped) {
                        return;
                    }
                }
            }
        }
    }

    pause(paused = true) {
        this.isPaused = paused;
    }
    stop() {
        this.stopped = true;
    }
}
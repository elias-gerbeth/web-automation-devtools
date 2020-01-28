import { ChromeTab } from '../tab/tab.class';
import { v1 as uuidv1 } from 'uuid';

export enum TabActionType {
    OpenURL = 'OpenURL',
    Close = 'Close',
    ClickSelector = 'ClickSelector',
    FillInputAtSelector = 'FillInputAtSelector',
    WaitForURLNavigation = 'WaitForURLNavigation',
    WaitForElementLoad = 'WaitForElementLoad',
}

export abstract class TabAction {
    readonly type: TabActionType;
    public readonly id: string;
    constructor() {
        this.id = uuidv1();
    }

    abstract run(tab: ChromeTab): Promise<void>;

    toJson(): string {
        return JSON.stringify(this);
    }
}

export class TabActionOpenURL extends TabAction {
    readonly type = TabActionType.OpenURL;
    constructor(private url: string) { super(); }
    async run(tab: ChromeTab) {
        return await tab.navigateToAndWaitForLoad(this.url);
    }
}

export class TabActionClick extends TabAction {
    readonly type = TabActionType.ClickSelector;
    constructor(private selector: string) { super(); }
    async run(tab: ChromeTab) {
        return await tab.click(this.selector);
    }
}

export class TabActionFillInput extends TabAction {
    readonly type = TabActionType.FillInputAtSelector;
    constructor(private selector: string, private text: string) { super(); }
    async run(tab: ChromeTab) {
        return await tab.fillInput(this.selector, this.text);
    }
}

export class TabActionClose extends TabAction {
    readonly type = TabActionType.Close;
    constructor() { super(); }
    async run(tab: ChromeTab) {
        return await tab.close();
    }
}
export class TabActionWaitForURLNavigation extends TabAction {
    readonly type = TabActionType.WaitForURLNavigation;
    constructor() { super(); }
    async run(tab: ChromeTab) {
        return await tab.waitForUrlChangeAndFinishLoad();
    }
}
export class TabActionWaitForElementLoad extends TabAction {
    readonly type = TabActionType.WaitForElementLoad;
    constructor(private selector: string) { super(); }
    async run(tab: ChromeTab) {
        return await tab.waitForSelectorExist(this.selector);
    }
}

export function deserializeTabAction(json: any) {
    if (!json.type) {
        throw new Error('action to deserialize had no type');
    }
    switch (json.type) {
        case TabActionType.OpenURL:
            return new TabActionOpenURL(json.url);
        case TabActionType.Close:
            return new TabActionClose();
        case TabActionType.FillInputAtSelector:
            return new TabActionFillInput(json.selector, json.text);
        case TabActionType.ClickSelector:
            return new TabActionClick(json.selector);
        case TabActionType.WaitForElementLoad:
            return new TabActionWaitForElementLoad(json.selector);
        case TabActionType.WaitForURLNavigation:
            return new TabActionWaitForURLNavigation();
        default:
            throw new Error('not a known action type:' + json.type);
    }
}
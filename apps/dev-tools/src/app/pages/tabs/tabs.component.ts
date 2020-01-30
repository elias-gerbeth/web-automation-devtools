import { Component, OnInit } from '@angular/core';
import { ChromeTab, TabActionType, TabAction, deserializeTabAction, TabActionRunner } from '@crx/tab-automation';
import { ModalFormItem } from '../../components/modal-form/modal-form.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as copyToClipboard from 'copy-text-to-clipboard';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
    public tabActionType = TabActionType;
    // selectorClick = '#global-search-submit';
    // url = 'https://walmart.com';
    // inputSelector = '#global-search-input';
    // inputValue = 'Chair';

    // tab: ChromeTab;

    loading = false;

    runner: TabActionRunner;
    running = false;
    paused = false;

    private _actions: TabAction[] = [];
    get actions() {
        return this._actions;
    }
    set actions(actions: TabAction[]) {
        this._actions = actions;
        localStorage.setItem('tabActions', JSON.stringify(actions));
    }

    actionTypes = [
        TabActionType.NavigateToURL,
        TabActionType.Close,
        TabActionType.ClickSelector,
        TabActionType.FillInputAtSelector,
        TabActionType.WaitForURLNavigation,
        TabActionType.WaitForElementLoad,
    ];

    isAddActionModalVisible = false;
    addModalItems: ModalFormItem[] = [];
    addActionModalTabActionType: TabActionType;
    editingAction = null;


    constructor(
        private msg: NzMessageService,
    ) {
        const actionsFromCache = localStorage.getItem('tabActions');
        if (actionsFromCache) {
            this.actions = JSON.parse(actionsFromCache);
        }
    }

    ngOnInit() {
    }

    // async openTab() {
    //     this.loading = true;
    //     if (this.tab) {
    //         await this.tab.navigateToAndWaitForLoad(this.url);
    //     } else {
    //         this.tab = await ChromeTab.createBackgroundTabWithUrl(this.url);
    //     }
    //     this.loading = false;
    // }

    // async closeTab() {
    //     if (!this.tab) { return; }
    //     this.loading = true;
    //     await this.tab.close();
    //     this.tab = null;
    //     this.loading = false;
    // }

    // async clickSelector() {
    //     if (!this.tab) { return; }
    //     this.loading = true;
    //     console.log('click on ', this.selectorClick);
    //     await this.tab.click(this.selectorClick);
    //     this.loading = false;
    // }

    // async fillInput() {
    //     if (!this.tab) { return; }
    //     this.loading = true;
    //     await this.tab.fillInput(this.inputSelector, this.inputValue);
    //     this.loading = false;
    // }

    addActionDropdownClick(actionType: TabActionType) {
        this.addActionModalTabActionType = actionType;
        this.addModalItems = [];
        switch (actionType) {
            case TabActionType.Close:
            case TabActionType.WaitForURLNavigation:
                this.addAction();
                return;
            case TabActionType.ClickSelector:
                this.addModalItems.push({ label: 'Selector to click', name: 'selector', type: 'selector', value: this.editingAction ? this.editingAction.selector : '' } as ModalFormItem);
                break;
            case TabActionType.NavigateToURL:
                this.addModalItems.push({ label: 'Url to open', name: 'url', type: 'text', value: this.editingAction ? this.editingAction.url : 'https://walmart.com' } as ModalFormItem);
                break;
            case TabActionType.FillInputAtSelector:
                this.addModalItems.push({ label: 'Input selector to fill', name: 'selector', type: 'selector', value: this.editingAction ? this.editingAction.selector : '' } as ModalFormItem);
                this.addModalItems.push({ label: 'Text to fill in', name: 'text', type: 'text', value: this.editingAction ? this.editingAction.text : '' } as ModalFormItem);
                break;
            case TabActionType.WaitForElementLoad:
                this.addModalItems.push({ label: 'Selector to wait for', name: 'selector', type: 'selector', value: this.editingAction ? this.editingAction.selector : '' } as ModalFormItem);
                break;
        }
        // activate modal
        this.isAddActionModalVisible = true;
    }

    addAction(items: ModalFormItem[] = []) {
        this.isAddActionModalVisible = false;
        if (this.editingAction) {
            for (const item of items) {
                this.editingAction[item.name] = item.value;
            }
            this.actions = [...this.actions.map(a => a.id === this.editingAction.id ? this.editingAction : a)];
            this.editingAction = null;
        } else {
            const params: any = {};
            for (const item of items) {
                params[item.name] = item.value;
            }
            const action = deserializeTabAction({ type: this.addActionModalTabActionType, ...params });
            this.actions = [...this.actions, action];
        }
    }

    edit(action: TabAction) {
        this.editingAction = action;
        this.addActionDropdownClick(action.type);
    }

    deleteAction(action: TabAction) {
        this.actions = [...this.actions.filter(a => a !== action)];
    }

    cancelModal() {
        this.isAddActionModalVisible = false;
        this.editingAction = null;
    }

    clear() {
        this.actions = [];
        this.msg.success('Cleared all actions');
    }

    drop(event: CdkDragDrop<string[]>) {
        console.log(event, this.actions);
        moveItemInArray(this.actions, event.previousIndex, event.currentIndex);
        this.actions = [...this.actions];
    }

    async run() {
        this.running = true;
        this.paused = false;
        this.runner = new TabActionRunner(this.actions, { currentTab: true });
        this.msg.success('Running..');
        await this.runner.run();
        // Clean up
        this.runner = null;
        this.running = false;
        this.msg.success('Run Completed');
    }

    async runSingleAction(action: TabAction) {
        const actionClass = this.actions.find(a => a.id === action.id);
        const runner = new TabActionRunner([actionClass], { currentTab: true });
        this.running = true;
        await runner.run();
        this.running = false;
        this.msg.success('Single action ' + action.type + ' completed');

    }

    togglePause() {
        this.paused = !this.paused;
        this.runner.pause(this.paused);
        this.msg.success(this.paused ? 'Paused running' : 'Resume running');
    }
    stopRunning() {
        this.runner.stop();
        this.msg.success('Stop');
    }

    export() {
        const cleanActions = this.actions.map(a => ({ ...a, id: undefined }));
        let result = `
        // Code Generated by ChromeAutomationDevTools
        const actions = ${JSON.stringify(cleanActions)};
        const runner = new TabActionRunner(actions);
        await runner.run();
        `;
        copyToClipboard(result);
        this.msg.success('Copied to clipboard!');
    }
}

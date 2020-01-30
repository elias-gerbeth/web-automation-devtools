/// <reference types="chrome"/>
import { v1 as uuidv1 } from 'uuid';

type PollingFunctionOrScript = (() => boolean) | string;

export class ChromeTab {

    /**
     * Tab ID (got from chrome)
     */
    private tabId: number;
    public getTabId() { return this.tabId; }
    private constructor() { }

    public static async create(props: chrome.tabs.CreateProperties): Promise<ChromeTab> {
        const tab = new ChromeTab();
        await tab.openTab(props);
        return tab;
    }
    public static async createBackgroundTabWithUrl(url: string): Promise<ChromeTab> {
        const tab = new ChromeTab();
        await Promise.all([
            tab.openTab({
                active: false,
                selected: false,
                url,
            }),
            tab.waitForUrlLoad(),
        ]);
        return tab;
    }

    public static async createEmptyBackgroundTab(): Promise<ChromeTab> {
        const tab = new ChromeTab();
        await tab.openTab({
            active: false,
            selected: false,
        });
        return tab;
    }

    public static async selectCurrentTab() {
        const tab = new ChromeTab();
        await tab.selectCurrentSelectedTab();
        return tab;
    }

    public async close() {
        await new Promise(r => chrome.tabs.remove(this.tabId, r));
    }

    public async navigateToAndWaitForLoad(url: string) {
        await Promise.all([
            this.setUrl(url),
            this.waitForUrlLoad(),
        ]);
    }

    public async click(singleSelector: string) {
        const script = `document.querySelector('${singleSelector}').click();`;
        await this.executeScript(script);
    }

    public async fillInput(singleSelector: string, value: string) {
        const script = `document.querySelector('${singleSelector}').value = '${value}';`;
        console.log('fill input script: ', script);
        await this.executeScript(script);
    }

    public async waitForUrlChangeAndFinishLoad() {
        await this.waitForUrlLoad();
    }

    public async waitForSelectorExist(singleSelector: string) {
        const script = `
        () => {
            return !!document.querySelector('${singleSelector}');
        }
        `;
        await this.waitForResponseMsgWithTimeout(script);
    }

    private async runPollScript(functionToWaitOnTrue: PollingFunctionOrScript) {
        const msgId = uuidv1();
        const script = `
        (async () => {
            const fn = ${functionToWaitOnTrue.toString()};
            while(true) {
                if(fn()) {
                    chrome.runtime.sendMessage({msgId: '${msgId}'});
                    break;
                }
                await new Promise(r => setTimeout(r,100));
            }
        })()
        `;
        await this.executeScript(script);
        return msgId;
    }

    private async waitForResponseMsgWithTimeout(functionToWaitOnTrue: PollingFunctionOrScript, timeoutMs = 10000) {
        const msgId = await this.runPollScript(functionToWaitOnTrue);
        let listener = null;
        const polling = new Promise(resolve => {
            listener = (message: any, sender: chrome.runtime.MessageSender) => {
                if (message.msgId === msgId) {
                    chrome.runtime.onMessage.removeListener(listener);
                }
            };
            chrome.runtime.onMessage.addListener(listener);
        });
        const timeout = new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                clearTimeout(id);
                chrome.runtime.onMessage.removeListener(listener);
                reject(`waiting for ${functionToWaitOnTrue.toString()} timed out`);
            }, timeoutMs);
        });
        try {
            await Promise.race([
                timeout,
                polling,
            ]);
        } catch (err) {
            console.log('timeout waiting for script ', functionToWaitOnTrue.toString());
            throw err;
        }
    }

    private async setUrl(url: string) {
        await new Promise(r => chrome.tabs.update(this.tabId, { url }, r));
    }

    private async waitForUrlLoad() {
        return await new Promise(resolve => {
            const updateListener = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (tabId === this.tabId && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(updateListener);
                    resolve();
                }
            };
            chrome.tabs.onUpdated.addListener(updateListener);
        });
    }

    private async openTab(props: chrome.tabs.CreateProperties) {
        const tab = await new Promise<chrome.tabs.Tab>(r => chrome.tabs.create(props, r));
        this.tabId = tab.id;
        return tab;
    }

    private async executeScript(script: string) {
        await new Promise(resolve => {
            chrome.tabs.executeScript(this.tabId, { code: script }, resolve);
        });
    }

    private async getTabProps(): Promise<chrome.tabs.Tab> {
        return await new Promise<chrome.tabs.Tab>(r => chrome.tabs.get(this.tabId, r));
    }

    private async selectCurrentSelectedTab() {
        const tabs = await new Promise<chrome.tabs.Tab[]>(r => chrome.tabs.query({ active: true, currentWindow: true }, r));
        if (!tabs || tabs.length <= 0) {
            throw new Error('Current Tab id not found! Is it a chrome tab or something?');
        }
        this.tabId = tabs[0].id;
    }
}
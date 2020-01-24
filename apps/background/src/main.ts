import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));

chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.extension.getURL('frontend/index.html') });
});


const filter: chrome.webRequest.RequestFilter = {
    urls: [
        '*://*.walmart.com/',
    ],
};
const opt_extraInfoSpec: string[] = ['requestHeaders', 'blocking', 'extraHeaders'];
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details: chrome.webRequest.WebRequestHeadersDetails): void | chrome.webRequest.BlockingResponse => {
        details.requestHeaders
            .filter(h => h.name.toLowerCase() !== 'origin')
            .filter(h => h.name.toLowerCase() !== 'referer')
            .forEach(h => {
                if (h.name === 'replace-referer') {
                    h.name = 'Referer';
                }
                if (h.name === 'replace-origin') {
                    h.name = 'Origin';
                }
            });
        return { requestHeaders: details.requestHeaders };
    }, filter, opt_extraInfoSpec);

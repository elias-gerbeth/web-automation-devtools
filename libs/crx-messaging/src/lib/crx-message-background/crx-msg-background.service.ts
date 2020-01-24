/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CrxBroadcastMessageForContentScript, CrxBroadcastMessageForWebApp } from '../interfaces/broadcast-message.interface';
import { CrxBroadCastToContentScriptType, CrxBroadcastToWebAppType } from '../interfaces/broadcast-types.enum';
import { CrxMessage } from '../interfaces/message.interface';
import { CrxRequestMessage } from '../interfaces/request-message.interface';
import { CrxRequestType } from '../interfaces/request-types.enum';
import { CrxRequestResponseMessage } from '../interfaces/RequestResponseMessage.interface';

@Injectable({
  providedIn: 'root'
})
export class CrxMessageServiceBackground {

  onContentScriptConnected$ = new Subject();

  private openPortsWebApp: chrome.runtime.Port[] = [];
  private openPortsContentScripts: chrome.runtime.Port[] = [];

  public incomingRequests = new Subject<{ port: chrome.runtime.Port, request: CrxRequestMessage }>();

  constructor() {
    this.init();
  }

  /**
   * Listen to incoming connections from the WebApp and keep track of open Ports
   */
  private init() {
    // WebApp
    chrome.runtime.onConnectExternal.addListener((portWebApp: chrome.runtime.Port) => {
      console.log('received connection from web app: ', portWebApp.name);

      this.openPortsWebApp.push(portWebApp);

      portWebApp.onDisconnect.addListener((closedPort: chrome.runtime.Port) => {
        const i = this.openPortsWebApp.indexOf(closedPort);
        if (i > -1) {
          this.openPortsWebApp.splice(i, 1);
        }
      });

      portWebApp.onMessage.addListener(async (message: CrxMessage) =>
        this.onIncomingMessageWebApp(message, portWebApp));

      // send confirmation message - necessary to check if really connected
      portWebApp.postMessage({ helloFromTheOtherSide: true });
    });

    // initialize communication with content scripts
    chrome.runtime.onConnect.addListener((portContentScript: chrome.runtime.Port) => {
      console.log('received connection from content script: ', portContentScript.name);
      this.openPortsContentScripts.push(portContentScript);

      portContentScript.onDisconnect.addListener((closedPort: chrome.runtime.Port) => {
        const i = this.openPortsContentScripts.indexOf(closedPort);
        if (i > -1) {
          this.openPortsContentScripts.splice(i, 1);
        }
      });

      portContentScript.onMessage.addListener(async (message: CrxMessage) => {
        this.onIncomingMessageContentScripts(message, portContentScript);
      });

      portContentScript.postMessage({ helloFromTheOtherSide: true });

      setTimeout(() => this.onContentScriptConnected$.next(portContentScript), 0);
    });
  }

  public requestHandlerFor(type: CrxRequestType, handler: (payload: any, respond: (payload) => void) => any) {
    this.incomingRequests.pipe(filter(msg => msg.request.type === type)).subscribe(async ({ request, port }) => {
      try {
        const respond = (payload: any) => { this.sendResultBack(request, port, payload, false); };
        const result = await handler(request.payload, respond);
        this.sendResultBack(request, port, result, true);
      } catch (err) {
        this.sendErrorBack(request, port, err.message);
      }
    });
  }


  public broadcastToWebApp(type: CrxBroadcastToWebAppType, payload: any) {
    if (this.openPortsWebApp.length > 0) {
      this.openPortsWebApp.forEach(function (port) {
        port.postMessage({ isBroadcast: true, payload, type } as CrxBroadcastMessageForWebApp);
      });
    }
  }

  public broadcastToContentScripts(type: CrxBroadCastToContentScriptType, payload: any) {
    if (this.openPortsContentScripts.length > 0) {
      this.openPortsContentScripts.forEach(function (port) {
        port.postMessage({ isBroadcast: true, payload, type } as CrxBroadcastMessageForContentScript);
      });
    }
  }

  /**
   * Incoming Messages from VelicoWebApps are handled here.
   */
  private onIncomingMessageWebApp(message: any, port: chrome.runtime.Port) {
    // console.log('got an external message on port ', port.name, message);
    if (message.isRequest) {
      // console.log('is Request! --> forward to subject');
      this.incomingRequests.next({
        port,
        request: message
      });
    }
  }

  /**
   * Incoming Messages from Content Scripts are handled here.
   */
  private onIncomingMessageContentScripts(message: any, port: chrome.runtime.Port) {
    // console.log('got an contentScript message on port ', port.name, ' message: ', message);
    if (message.isRequest) {
      this.incomingRequests.next({
        port,
        request: message
      });
    }
  }

  private sendResultBack(request: CrxRequestMessage, port: chrome.runtime.Port, result: any, completed = true) {
    if (!this.isPortStillOpen(port)) {
      return;
    }
    const resultMessage: CrxRequestResponseMessage = {
      id: request.id,
      isRequestResponseMessage: true,
      payload: result,
      isCompleted: completed
    };
    port.postMessage(resultMessage);
  }

  private sendErrorBack(request: CrxRequestMessage, port: chrome.runtime.Port, errorMessage: string) {
    if (!this.isPortStillOpen(port)) {
      return;
    }
    const resultMessage: CrxRequestResponseMessage = {
      id: request.id,
      isRequestResponseMessage: true,
      isError: true,
      errorMessage,
      payload: null,
      isCompleted: true,
    };
    port.postMessage(resultMessage);
  }

  private isPortStillOpen(port: chrome.runtime.Port) {
    return port && (this.openPortsContentScripts.find(p => p.name === port.name) ||
      this.openPortsWebApp.find(p => p.name === port.name));
  }
}

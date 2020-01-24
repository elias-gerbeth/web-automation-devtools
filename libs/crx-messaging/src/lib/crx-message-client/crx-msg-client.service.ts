/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject, throwError } from 'rxjs';
import { filter, map, takeWhile, tap } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { CrxBroadcastMessageForContentScript, CrxBroadcastMessageForWebApp } from '../interfaces/broadcast-message.interface';
import { CrxBroadCastToContentScriptType, CrxBroadcastToWebAppType } from '../interfaces/broadcast-types.enum';
import { CrxRequestMessage } from '../interfaces/request-message.interface';
import { CrxRequestType } from '../interfaces/request-types.enum';
import { CrxRequestResponseMessage } from '../interfaces/RequestResponseMessage.interface';

import { environment } from '@environment';

/**
 * Useable as a Singleton namespace
 * Can setup a connection to the background and keep track of messages with MessageHandlers
 */
@Injectable({
  providedIn: 'root',
})
export class CrxMsgClientService {

  public readonly incomingBroadcastMessagesForWebApp$ = new Subject<CrxBroadcastMessageForWebApp>();
  public readonly incomingBroadcastMessagesForContentScript$ = new Subject<CrxBroadcastMessageForContentScript>();
  private readonly requestResponses$ = new Subject<CrxRequestResponseMessage>();

  private activePort: chrome.runtime.Port;

  private connected = false;
  public get isConnected() { return this.connected; }
  private isConnectedSubject$ = new BehaviorSubject<boolean>(false);
  public get isConnected$() {
    return this.isConnectedSubject$.asObservable();
  }

  constructor() {
    this.connect();
    interval(1000).subscribe(x => {
      this.connect();
    });
  }

  public connect() {
    if (this.connected) {
      return true;
    }
    const name = uuidv1();
    try {
      if (typeof chrome !== 'object' || !chrome || !chrome.runtime || !chrome.runtime.connect) {
        throw new Error('Chrome Runtime is not available!');
      }
      this.activePort = chrome.runtime.connect(environment.crxId, { name });
      const error = chrome.runtime.lastError;
      if (!this.activePort.name || error) {
        throw new Error('Chrome Extension is not available');
      }
    } catch (error) {
      return false;
    }
    // async is needed to keep the console clean when connection fails (https://github.com/mozilla/webextension-polyfill/issues/130)
    this.activePort.onDisconnect.addListener(async (port: chrome.runtime.Port) => {
      // read runtime error to keep the console quiet when extension not available
      const error = chrome.runtime.lastError;
      if (this.connected) {
        console.log('Chrome Extension disconnected');
        this.connected = false;
        this.isConnectedSubject$.next(false);
      }
      this.activePort = null;
    });
    // async is needed to keep the console clean when connection fails (https://github.com/mozilla/webextension-polyfill/issues/130)
    this.activePort.onMessage.addListener(async (message: any, port: chrome.runtime.Port) => {
      // read runtime error to keep the console quiet when extension not available
      const error = chrome.runtime.lastError;
      if (message.helloFromTheOtherSide) {
        this.connected = true;
        this.isConnectedSubject$.next(true);
        console.log('Connection to ChromeExtension established');
      } else if (message.isRequestResponseMessage) {
        this.requestResponses$.next(<CrxRequestResponseMessage>message);
      } else if (message.isBroadcast || message.isForWebApp) {
        this.incomingBroadcastMessagesForWebApp$.next(<CrxBroadcastMessageForWebApp>message);
      } else if (message.isBroadcast || message.isForContentScript) {
        this.incomingBroadcastMessagesForContentScript$.next(<CrxBroadcastMessageForContentScript>message);
      }
    });
    return true;
  }

  public receiveBroadcastsForWebApp(msgType: CrxBroadcastToWebAppType): Observable<any> {
    return this.incomingBroadcastMessagesForWebApp$.pipe(
      tap(msg => {
        if (msg.isError) {
          throwError(new Error(msg.errorMessage));
        }
      }),
      filter(msg => msg.type === msgType),
      map(msg => msg.payload),
    );
  }

  public receiveBroadcastsForContentScript(msgType: CrxBroadCastToContentScriptType): Observable<any> {
    return this.incomingBroadcastMessagesForContentScript$.pipe(
      tap(msg => {
        if (msg.isError) {
          throwError(new Error(msg.errorMessage));
        }
      }),
      filter(msg => msg.type === msgType),
      map(msg => msg.payload),
    );
  }

  public request(type: CrxRequestType, payload: any): Observable<any> {
    if (!this.isConnected) {
      return throwError(new Error('Could not connect to Chrome-Extension'));
    }
    const messageId = uuidv1();
    const requestMessage: CrxRequestMessage = { id: messageId, payload, type, isRequest: true };
    this.activePort.postMessage(requestMessage);
    let completed = false;
    return this.requestResponses$.pipe(
      filter(msg => msg.id === messageId),
      tap(msg => {
        if (msg.isError) {
          throw new Error(msg.errorMessage);
        }
      }),
      tap(msg => { if (msg.isCompleted || msg.payload.error) { completed = true; } }),
      takeWhile(msg => !completed, true),
      map(msg => msg.payload),
    );
  }
}

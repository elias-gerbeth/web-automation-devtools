///<reference types="chrome"/>
import { Injectable } from '@angular/core';
import * as jQuery from 'jquery';

export interface WalmartAtcInputData {
    itemUrl: string;
    quantity: number;
}

export interface WalmartLoginInput {
    email: string;
    password: string;
}
interface WalmartLoginBody {
    username: string;
    password: string;
    rememberme: boolean;
    showRememberme: string;
    captcha?: {
        sensorData: string;
    }
}


interface WalmartATCData {
    offerId: string;
    quantity: number;
    storeIds: number[];
    location: {
        postalCode: string,
        city?: string,
        state?: string,
        isZipLocated?: boolean,
    }
    shipMethodDefaultRule: string;
}
interface WalmartItemData {
    productId: string;
    offerId: string;
    storeIds: number[];
    location: {
        postalCode: string,
        city: string,
        state: string,
        country: string,
        isZipLocated: boolean,
    }
}

interface WalmartCart {
    customerId: string;
    itemCount: number;
    currencyCode: string;
    subTotal: number;
    shippingTotal: number;
    taxTotal: number;
    grandTotal: number;
    // more available in response obj if needed later
}

interface WalmartSetShippingAddressData {
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    firstName: string;
    lastName: string;
    phone: string;
    postalCode: string;
    state: string;
    countryCode: string;
    isDefault: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class WalmartService {

    constructor() { }

    async getItemPageData(itemUrl: string): Promise<WalmartItemData> {
        const result = await fetch(itemUrl);
        const html = await result.text();

        const jq = jQuery(jQuery.parseHTML(html));
        const scriptContent = jq.find('script#item').html();
        const obj = JSON.parse(scriptContent);
        const item = obj.item;
        const offerId = item.product.buyBox.products[0].offerId;
        const productId = item.productId;
        const storeIds = item.location.location.stores.map((s: any) => s.storeId);
        const location = item.location.location;
        return {
            location: {
                postalCode: location.postalCode,
                city: location.city,
                state: location.state,
                country: location.country,
                isZipLocated: location.isZipLocated,
            },
            productId,
            storeIds,
            offerId,
        };
    }

    async addToCart({ itemUrl, quantity }: WalmartAtcInputData) {
        const { productId, offerId, storeIds, location } = await this.getItemPageData(itemUrl);
        console.log('productId', productId, 'offerId', offerId, 'storeIds', storeIds, 'location', location);
        const atcData: WalmartATCData = {
            location,
            offerId,
            quantity,
            shipMethodDefaultRule: 'SHIP_RULE_1',
            storeIds,
        };
        const result = await this.doATC(atcData, itemUrl);
        const giftResult = await this.markAsGiftOrder();
        const cart = result.cart;
        console.log('add to cart result data:', result);
        return {
            currencyCode: cart.currencyCode,
            customerId: cart.customerId,
            itemCount: cart.itemCount,
            grandTotal: cart.totals.grandTotal,
            shippingTotal: cart.totals.shippingTotal,
            subTotal: cart.totals.subTotal,
            taxTotal: cart.totals.taxTotal,
        };
    }

    private async doATC(data: WalmartATCData, referrer: string) {
        // const url = 'https://www.walmart.com/api/v3/cart/:CRT/items'; // used when not logged in
        const url = 'https://www.walmart.com/api/v3/cart/customer/:CID/items';
        const result = await fetch(url, {
            credentials: 'include',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'replace-referer': referrer,
                'replace-origin': 'https://www.walmart.com',
                'user-agent': navigator.userAgent,
            },
            mode: 'same-origin',
            body: JSON.stringify(data),
            method: 'POST'
        });
        return await result.json();
    }

    async getCart(): Promise<WalmartCart> {
        const url = 'https://www.walmart.com/cart';
        const result = await fetch(url);
        const html = await result.text();
        const jq = jQuery(jQuery.parseHTML(html));
        const scriptContent = jq.find('script').filter(function () {
            return !!$(this).html().match(/window\.__WML_REDUX_INITIAL_STATE__ ?= ?/);
        }).html().replace(/window\.__WML_REDUX_INITIAL_STATE__ ?= ?/, '');
        // tslint:disable-next-line:no-eval
        const obj = eval('obj=' + scriptContent);
        const cart = obj.cart;
        console.log('cart page data:', obj);
        return {
            currencyCode: cart.currencyCode,
            customerId: cart.customerId,
            itemCount: cart.itemCount,
            grandTotal: cart.totals.grandTotal,
            shippingTotal: cart.totals.shippingTotal,
            subTotal: cart.totals.subTotal,
            taxTotal: cart.totals.taxTotal,
        };
    }

    async markAsGiftOrder() {
        const url = 'https://www.walmart.com/api/v3/cart/:CRT/giftorder';
        const result = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'replace-origin': 'https://www.walmart.com',
                'replace-referer': 'https://www.walmart.com/cart',
                'user-agent': navigator.userAgent,
            },
            body: JSON.stringify({ giftOrder: true }),
            mode: 'same-origin',
        });
        const json = await result.json();
        console.log(json);
        return json;
    }

    async giftDetails(recipientEmail: string, recipientName: string, senderName: string, message: string) {
        const url = 'https://www.walmart.com/api/checkout/v3/contract/:PCID/giftDetails';
        const body = {
            recipientName,
            recipientEmail,
            senderName,
            message,
            marketingEmailPref: false,
        };
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'replace-origin': 'https://www.walmart.com',
                'replace-referer': 'https://www.walmart.com/cart',
                'user-agent': navigator.userAgent,
            },
            body: JSON.stringify(body),
            mode: 'same-origin',
        });
        const json = await result.json();
        return json;
    }

    // Shipping address
    async setShippingAddress() {
        const shippingAddress: WalmartSetShippingAddressData = {
            firstName: 'Melvin',
            lastName: 'Johnson',
            addressLineOne: '251 San Carlos St',
            addressLineTwo: '',
            state: 'FL',
            postalCode: '34275',
            city: 'Nokomis',
            countryCode: 'USA',
            isDefault: true,
            phone: '9414801242',
        };
        return this._setShippingAddress(shippingAddress);
    }
    private async _setShippingAddress(shippingAddress?: WalmartSetShippingAddressData) {
        const url = 'https://www.walmart.com/api/checkout-customer/:CID/shipping-address';
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'replace-referer': 'https://www.walmart.com/checkout/',
                'replace-origin': 'https://www.walmart.com',
                'user-agent': navigator.userAgent,
            },
            body: JSON.stringify(shippingAddress),
            mode: 'same-origin',
        });
        const json = await result.json();
        console.log('set shipping address result: ', json);
        return json;
    }

    // ---------------
    // Authentication
    // ---------------
    // TODO: how to break sensor data captcha!?
    async login({ email, password }: WalmartLoginInput) {
        // const body: WalmartLoginBody = {
        //     username: email,
        //     password,
        //     rememberme: true,
        //     showRememberme: "true",
        //     // captcha: {
        //     //     // '2a25G2m84Vrp0o9c4081471.12-1,8,-36,-890,Mozilla/9.8 (Macintosh; Intel Mac OS X 74_94_5) AppleWebKit/227.39 (KHTML, like Gecko) Chrome/76.3.3807.20 Safari/636.52,uaend,82457,82672914,de-DE,Gecko,1,7,0,0,487325,6045418,4029,3699,2610,1390,7577,603,1623,,cpen:2,i8:0,dm:0,cwen:8,non:1,opc:2,fc:1,sc:0,wrc:3,isc:7,vib:2,bat:5,x28:0,x43:0,0571,1.706957300668,596804140249.1,loc:-1,2,-93,-743,do_en,dm_en,t_en-8,2,-25,-721,2,1,0,8,830,146,2;2,9,8,4,879,425,1;9,7,3,1,7531,8,7;0,-4,0,6,-5,-2,9;8,-2,9,2,-3,-8,0;0,1,9,3,5472,834,3;0,6,6,3,2865,852,9;2,6,9,8,767,629,2;5,0,8,1,1470,409,2;1,9,7,4,1516,4,8;7,2,0,2,631,948,7;0,-4,0,6,-5,-2,9;8,-2,9,2,-3,-8,0;0,1,9,3,000,540,0;2,1,2,5,9223,586,0;6,-5,8,8,1341,0,6;6,-9,7,0,-4,-0,2;5,-2,9,7,-2,-7,6;2,3,9,8,4538,191,8;7,2,0,2,0949,002,9;7,5,0,7,587,699,7;4,0,6,7,3115,853,1;9,2,4,9,8709,3,0;6,8,3,2,0284,629,2;5,0,8,1,1887,409,2;1,9,7,4,2933,4,8;8,0,0,2,0032,064,9;7,3,0,7,7338,7,0;0,1,9,3,105,540,0;1,9,2,5,9732,8186,9;-7,4,-63,-133,9,2,5,9,210,551,9;3,4,9,8,853,982,2;4,8,7,1,1687,6,6;2,-8,0,0,-1,-3,4;9,-0,7,3,-0,-7,2;1,9,8,4,1153,355,7;0,0,2,0,3717,990,7;3,2,7,7,978,427,3;1,8,7,3,2850,814,9;2,4,8,8,1357,0,6;6,4,2,0,472,516,6;2,-8,0,0,-1,-3,4;9,-0,7,3,-0,-7,2;1,9,7,4,678,492,1;0,9,4,1,7318,690,0;0,-1,6,7,3455,0,0;1,-7,6,2,-8,-8,3;1,-3,4,8,-0,-1,1;9,4,4,9,8336,247,6;6,4,1,0,8354,783,4;8,9,0,1,044,784,8;8,0,1,2,0924,064,9;7,3,0,7,7220,7,0;0,3,0,3,5495,427,3;1,8,7,3,2267,814,9;2,4,8,8,2774,0,6;7,2,2,0,8447,745,4;8,7,0,1,2906,6,2;1,9,7,4,773,492,1;9,7,3,1,7827,9224,7;-2,1,-58,-277,7,4,446,6,2,27,-8,3;1,8,094,1,9,80,-1,6;8,3,531,7,3,19,-7,2;4,1,166,0,6,74,-2,9;1,4,466,6,2,27,-8,3;5,8,012,1,9,80,-1,6;2,3,769,7,3,19,-7,2;8,1,393,0,6,74,-2,9;5,4,799,6,2,27,-8,3;9,8,346,1,9,80,-1,6;74,9,412,0,1,06,-5,8;80,9,032,6,6,38,-0,7;-2,1,-58,-289,7,4,1503,5580,72;1,2,0265,3081,173;3,0,3294,2921,162;2,3,5904,651,599;0,7,3532,713,399;7,5,9801,414,286;2,3,2424,733,152;1,9,8631,903,818;0,2,0710,760,450;7,8,1446,649,838;27,1,1054,264,477;01,1,3155,280,368;82,2,1790,828,196;44,0,4717,716,992;13,3,6357,544,509;77,5,0248,349,284;70,9,9080,956,813;35,8,2887,631,837;25,1,2495,261,475;09,1,3173,287,361;90,2,1705,826,197;52,0,4734,714,981;21,3,6375,542,595;85,5,0265,349,277;88,9,9094,956,895;303,2,9595,437,534,-0;877,4,8998,581,107,-1;791,4,3425,705,099,-3;247,0,5024,930,943,-8;489,0,9437,466,167,-7;722,3,2089,875,390,-2;162,6,4562,5311,374,4481;420,2,1547,4239,631,9451;960,2,0804,9209,170,1244;719,0,6047,1065,882,8289;602,0,2881,8000,774,7546;100,2,6774,7367,271,1085;586,9,0343,510,509,-7;819,3,6041,762,832,8071;949,8,5439,590,445,0790;860,2,6255,860,836,8289;900,0,5725,698,449,0908;872,1,6338,860,836,8289;254,9,77915,577,749,-3;363,1,10855,532,857,-0;649,2,75468,749,132,-0;-7,4,-63,-148,-7,8,-75,-181,-1,8,-36,-899,-4,2,-10,-921,-8,5,-80,-521,0,2251;2,9016;1,1491;5,5679;7,4411;-1,3,-56,-393,-1,2,-93,-757,8880,287077,6,2,1,9,966370,39258,8476845223950,9648884548469,31,23807,43,809,6097,04,0,23795,620490,7,jpep4crqrtgmi5gaw9rt_4650,3006,18,-0210151739,00571555-5,0,-84,-416,-3,4-9,9,-64,-79,-141700424;3,12,31,34,87,90,37,80,61,41,32,67,23,92,10,30,44,42,60,0;,4,8;true;true;true;-63;true;66;31;true;false;-9-8,2,-25,-42,1629-0,9,-04,-370,19836388-1,8,-36,-808,186644-7,4,-63,-152,;10;4;3',
        //     //     sensorData: '',
        //     // }
        // };
        // const url = 'https://www.walmart.com/account/electrode/api/signin?ref=domain';
        // const result = await fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'application/json',
        //         'replace-origin': 'https://www.walmart.com',
        //         'replace-referer': 'https://www.walmart.com/account/login?ref=domain',
        //         'user-agent': navigator.userAgent,
        //     },
        //     body: JSON.stringify(body),
        //     mode: 'same-origin',
        // });

        const loginUrl = 'https://www.walmart.com/account/login?ref=domain';
        const code = `
        document.querySelector('#email').value='${email}';
        document.querySelector('#password').value='${password}';
        document.querySelector('[data-automation-id="signin-submit-btn"]').click();
        `;
        await new Promise(resolve =>
            chrome.tabs.create({
                active: false, selected: false, url: loginUrl
            }, tab => {
                const tabId = tab.id;
                console.log('script execute', tabId);
                chrome.tabs.executeScript(tabId, {
                    code,
                    runAt: 'document_idle'
                }, result => {
                    console.log('script finished execution', result);
                    setTimeout(() => {
                        chrome.tabs.remove(tabId);
                        resolve();
                    }, 5000);
                });
            })
        );

        // // Check if successfull
        const account = await this.getAccount();
        return account && account.emailAddress;
    }
    async getAccount() {
        const referer = 'https://www.walmart.com/account/?action=SignIn&rm=true';
        const url = 'https://www.walmart.com/account/electrode/account/api/profile';
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'replace-referer': referer,
                'replace-origin': 'https://www.walmart.com',
                'user-agent': navigator.userAgent,
            },
            mode: 'same-origin',
        });
        return await result.json();
    }
}

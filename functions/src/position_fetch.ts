import { DocumentData } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { Change, EventContext } from 'firebase-functions';
// import metascraper from 'metascraper';
// import getHTML from 'html-get';
const getHTML = require('html-get')
/**
 * `browserless` will be passed to `html-get`
 * as driver for getting the rendered HTML.
 */
const browserless = require('browserless')()
// import browserless from 'browserless';
// const got = require('got')
// import got from 'got';


export const positionFetch = 
		functions.firestore
		.document('positionFetch/{uid}')
		.onWrite(
async (change: Change<DocumentData>, context: EventContext) =>
{

    const data = change.after.data();
    console.log(`product fetch updated: `, data);

    if(data!==undefined) {
                 
        //var matches = data['url'].match(/\bhttps?:\/\/\S+/gi);
        var matches = data['url'].match(/https?:\/\/\S+/gi);
        if(matches==null || matches.length==0)   {
            console.log(`No proper URL found in ${data['url']}, save error`);
            await change.after.ref.update({
                error: 'No URL'
            });    
            return;
        }

        const targetUrl=matches[0];
        let metadata;
        try {
            console.log(`execute got on ${targetUrl}`);


            /**
             * The main logic
             */
            getContent(targetUrl)
              //.then(metascraper)
              .then(metadata => console.log(metadata))
              .then(browserless.close)
              ////.then(process.exit)

            // const { body: html, url } = await got(targetUrl, {timeout:1000, retry:2,
            //     headers: {
            //         "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
            //     }
            // });
            //console.log(`got data: ${html}`);
            //console.log(`execute metascraper on ${html.toString()}`);
            // metadata = await metascraper({ html, url });
            
            // if(!Number.isInteger(metadata.price)) {

            //     console.log(`no price found at ${targetUrl}`);
    
            //     const parse = require("parse-url")
            //     var parsedUrl=parse(targetUrl);      
    
            //     if(parsedUrl.resource=='www.asos.com') {
            //         const productId=findProductInAsosURL(targetUrl);

            //         if(productId===undefined) {
            //             throw Error("Product ID not found in asos URL");
            //         }
            //         const productUrl=`https://www.asos.com/api/product/catalogue/v3/stockprice?productIds=${productId}&store=RU&currency=RUB`;//&keyStoreDataversion=3pmn72e-27`;
            //         console.log(`identified source as www.asos.com, find product price via api by ${productId} from ${productUrl}`);

            //         try {
                        
            //             const { body: priceHtml } = await got(
            //                     productUrl                   
            //                     , {timeout:3000,
            //                     // headers: {
            //                     // "Host": "www.asos.com",
            //                     // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:85.0) Gecko/20100101 Firefox/85.0",
            //                     // "Accept": "*/*",
            //                     // "Accept-Language": "en-US,en;q=0.5",
            //                     // "Accept-Encoding": "gzip, deflate, br",
            //                     // "Referer": targetUrl,
            //                     // "asos-c-name": "asos-web-productpage",
            //                     // "asos-c-version": "1.0.0-223ded634252-2394",
            //                     // "Connection": "keep-alive",
            //                     // "Cache-Control": "max-age=0",
            //                 //}
            //             });
            //             var priceFound=jsonRecursive(JSON.parse(priceHtml), 0)
        
            //             console.log(`asos price found: ${priceFound}`);

            //             if(Number.isNaN(priceFound)) {
            //                 throw Error('No price found via asos product api');    
            //             }
            //             metadata.price=priceFound;
                    
            //         } catch(e) {
            //             var parsedProductUrl=parse(productUrl);   
            //             let id=parsedProductUrl.resource+parsedProductUrl.pathname.replaceAll('/', ':');
            //             console.log(`save missing price product at ${id}`);
            //             await db.collection('missingPriceProduct')
            //                   .doc(id)
            //                   .set({
            //                 't': admin.firestore.FieldValue.serverTimestamp(),
            //                 'href': parsedUrl.href,
            //                 'metadata': metadata
            //                   });
                        
            //             throw Error(`No price found on asos product page ${e}`);        
            //         }
            //     } else {
            //         let id=parsedUrl.resource+parsedUrl.pathname.replaceAll('/', ':');
            //         console.log(`save missing price product at ${id}`);
            //         await db.collection('missingPriceProduct')
            //                   .doc(id)
            //                   .set({
            //                 't': admin.firestore.FieldValue.serverTimestamp(),
            //                 'href': parsedUrl.href,
            //                 'metadata': metadata
            //                   });
            //         throw Error('No price found on unknown page');
            //     }
            // }

            // if(metadata.price<200)
            //     metadata.price=200;

        } catch(e) {
            await change.after.ref.update({
                error: e// e.message
            });
            return;
        }

        await change.after.ref.update({
            url:matches[0],
            metadata:metadata});
        
    }
});


const getContent = async (url:any) => {
  // create a browser context inside the main Chromium process
  //const browserContext = browserless.createContext()
  const promise = getHTML(url, { getBrowserless: () =>
    null
  //  browserContext
   })
  // close browser resources before return the result
  //promise.then(() => browserContext).then((browser:any) => browser.destroyContext())
  return promise
}

// function findProductInAsosURL(url:string) {
//     //let str='https://www.asos.com/ru/kingsley-ryan/koltso-izsterlingovogo-serebra-sakvamarinom-kamnem-dlyarodivshihsya-v-marte-kingsley-ryan/prd/23355885?clr=silver-birthstones&colourwayid=60474296&SearchQuery=&cid=4175';
//     var m = /prd\/(\d+)/.exec(url);
//     if (m && m.length>1) {
//         // m[1] has the number (as a string)
//         //console.log(m[1]);
//         return m[1];
//     }
//     return undefined;
// }



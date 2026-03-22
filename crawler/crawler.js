import { PlaywrightCrawler } from "crawlee";
import { Dataset } from "crawlee";

const crawler = new PlaywrightCrawler({
    async requestHandler({page, request, enqueueLinks}){
        const title = await page.title();
        console.log(`TITLE: ${title}`);
        console.log(`URL: ${request.url}`);

        const body = await page.evaluate(()=> {
            return document.body.innerText;
        })
        
        await enqueueLinks({
            selector: 'a'
        })

        await Dataset.pushData({
            title: title,
            url: request.url,
            body: body.slice(0, 200)
        })
    }
})

await crawler.run([
    'https://books.toscrape.com/catalogue/category/books/travel_2/index.html'
])
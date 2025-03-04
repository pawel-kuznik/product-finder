import { ProductResult } from "./ProductResult";
import { WebsiteSeeker } from "./WebsiteSeeker";

/**
 *  The URLSeeker takes an URL, fetches the content, and then looks for products
 *  data inside the downloaded content.
 */
export class UrlSeeker {

    async find(url: string) : Promise<ProductResult[]> {

        const response = await fetch(url, { redirect: "follow" });
        const html = await response.text(); 

        const websiteSeeker = new WebsiteSeeker();

        return websiteSeeker.find(html);
    }
};

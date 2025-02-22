import parse from "node-html-parser";
import { JSONSeeker } from "./JSONSeeker";
import { SchemaProduct } from "./schemas";

/**
 *  This is a class that will look for products in html content. The class
 *  targets <script> tags with type "application/ld+json" which is how much
 *  of schema.org data is inserted in to a website. From this data we can get
 *  information about products, organization, and so on.
 */
export class WebsiteSeeker {

    /**
     *  Find products inside passed HTML string.
     */
    find(suspectedHtml: string) : SchemaProduct[] {

        const dom = parse(suspectedHtml);

        const scripts = dom.querySelectorAll('script[type="application/ld+json"]');
        const products: SchemaProduct[] = [];

        scripts.map(s => {

            const jsonSeeker = new JSONSeeker();
            products.push(...jsonSeeker.find(s.innerText.toString()));
        });

        return products;
    }
};

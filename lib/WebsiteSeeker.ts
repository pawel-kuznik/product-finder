import parse from "node-html-parser";
import { JSONSeeker } from "./JSONSeeker";
import { SchemaProduct } from "./schemas";
import { ElementSchemaSeeker } from "./ElementSchemaSeeker";

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

        const products: SchemaProduct[] = [];

        const jsonSeeker = new JSONSeeker();
        dom.querySelectorAll('script[type="application/ld+json"]').map(s => {
            products.push(...jsonSeeker.find(s.innerText.toString()));
        });

        const elementSeeker = new ElementSchemaSeeker();
        dom.querySelectorAll('*[itemtype*="://schema.org/Product"]').map(e => {
            products.push(...elementSeeker.find(e));
        });

        return products;
    }
};

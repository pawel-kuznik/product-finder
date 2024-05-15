import parse from "node-html-parser";
import { JSONSeeker } from "./JSONSeeker";
import { SchemaProduct } from "./schemas";

export class WebsiteSeeker {


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

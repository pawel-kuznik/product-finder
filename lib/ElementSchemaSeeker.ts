import { SchemaProduct } from "./schemas";
import { HTMLElement } from "node-html-parser";

/**
 *  This is a product seeker that looks for data inside a specific
 *  HTML element. This seeker should work in similar way to JSONSeeker.
 */
export class ElementSchemaSeeker {

    /**
     *  Find product information inside a specific element. The element
     *  is supposed to have itemtype set to Product.
     */
    find(input: HTMLElement) : SchemaProduct[] {

        const products: SchemaProduct[] = [];

        const itemtype = input.getAttribute("itemtype");
        if (itemtype !== "http://schema.org/Product" && itemtype !== "https://schema.org/Product") throw Error("Missing Product type");

        const productSchema: SchemaProduct = {
            "@context": "http://schema.org",
            "@type": "Product",
            "name": "",
            "url": "",
            "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "EUR",
                "url": "",
                "priceValidUntil": ""
            }
        };

        const name = findRelatedChild(input, '*[itemtype]', '*[itemprop="name"]');
        if (name) productSchema.name = extractProperty(name);

        const brand = findRelatedChild(input, '*[itemtype]', '*[itemprop="brand"]');
        if (brand) productSchema.brand = extractProperty(brand);

        return [ productSchema ];
    }
};

function findRelatedChild(parent: HTMLElement, parentSelector: string, childSelector: string) : HTMLElement|null {

    const child = parent.querySelector(childSelector);
    if (!child) return null;

    // The following is to make sure that we are tackling the nearest child.
    // While in more conventional DOM environment we could just use an equality
    // operator, with out nore-dom-parser we can't do it. The parser doesn't
    // use references to objects and creates copies on each query.
    const confirmParent = child.closest(parentSelector);
    if (parent.outerHTML != confirmParent?.outerHTML) return null;

    return child;
}

function extractProperty(target: HTMLElement) : string {

    //  try to first get content attribute. This is the one that is used in conjunction
    //  with <meta> tags. In most of the cases it will be either the innerText of
    //  the content attribute value, but it's better to keep an eye for more exotic places
    //  where the property value could be. 
    const content = target.getAttribute("content");
    return content ? content : target.innerText;
}
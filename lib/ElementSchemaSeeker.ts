import { extractProperty } from "./domUtils/extractProperty";
import { findRelatedChild } from "./domUtils/findRelatedChild";
import { SchemaItemAvailability, SchemaOffer, SchemaProduct } from "./schemas";
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

        const itemtype = input.getAttribute("itemtype");
        if (itemtype !== "http://schema.org/Product" && itemtype !== "https://schema.org/Product") throw Error("Missing Product type");

        const productSchema: SchemaProduct = {
            "@context": "http://schema.org",
            "@type": "Product",
            "name": "",
            "url": "",
            "offers": {
                "@context": "http://schema.org",
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "EUR",
                "url": "",
                "priceValidUntil": ""
            }
        };

        const name = findRelatedChild(input, '*[itemtype]', '*[itemprop="name"]');
        if (name) productSchema.name = extractProperty(name);

        const url = findRelatedChild(input, '*[itemtype]', '*[itemprop="url"]');
        if (url) productSchema.url = extractProperty(url);

        const image = findRelatedChild(input, '*[itemtype]', '*[itemprop="image"]');
        if (image) productSchema.image = extractProperty(image);

        // @todo brand is a more complex structure. It needs special parsing.
        const brand = findRelatedChild(input, '*[itemtype]', '*[itemprop="brand"]');
        if (brand) productSchema.brand = extractProperty(brand);

        const sku = findRelatedChild(input, '*[itemtype]', '*[itemprop="sku"]');
        if (sku) productSchema.sku = extractProperty(sku);

        const gtin = findRelatedChild(input, '*[itemtype]', '*[itemprop="gtin"]');
        if (gtin) productSchema.gtin = extractProperty(gtin);

        const gtin8 = findRelatedChild(input, '*[itemtype]', '*[itemprop="gtin8"]');
        if (gtin8) productSchema.gtin8 = extractProperty(gtin8);

        const gtin12 = findRelatedChild(input, '*[itemtype]', '*[itemprop="gtin12"]');
        if (gtin12) productSchema.gtin12 = extractProperty(gtin12);

        const gtin13 = findRelatedChild(input, '*[itemtype]', '*[itemprop="gtin13"]');
        if (gtin13) productSchema.gtin13 = extractProperty(gtin13);

        const gtin14 = findRelatedChild(input, '*[itemtype]', '*[itemprop="gtin14"]');
        if (gtin14) productSchema.gtin14 = extractProperty(gtin14);

        const offers = findRelatedChild(input, '*[itemtype*=Product]', '*[itemprop="offers"]');
        if (offers) {
            const processedOffers = this.findOffer(offers);
            if (processedOffers) productSchema.offers = processedOffers;
        }

        return [ productSchema ];
    }

    private findOffer(input: HTMLElement): SchemaOffer {

        const itemtype = input.getAttribute("itemtype");
        if (itemtype !== "http://schema.org/Offer" && itemtype !== "https://schema.org/Offer") throw Error("Missing Offer type");

        const offerSchema: SchemaOffer = {
            "@context": "http://schema.org",
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR",
            "url": "",
            "priceValidUntil": ""
        };

        const price = findRelatedChild(input, '*[itemtype]', '*[itemprop="price"]');
        if (price) offerSchema.price = extractProperty(price);

        const url = findRelatedChild(input, '*[itemtype]', '*[itemprop="url"]');
        if (url) offerSchema.url = extractProperty(url);

        const priceCurrency = findRelatedChild(input, '*[itemtype]', '*[itemprop="priceCurrency"]');
        if (priceCurrency) offerSchema.priceCurrency = extractProperty(priceCurrency);

        const availability = findRelatedChild(input, '*[itemtype]', '*[itemprop="availability"]');
        if (availability) offerSchema.availability = extractProperty(availability) as SchemaItemAvailability;

        return offerSchema;
    }
};

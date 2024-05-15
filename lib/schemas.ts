export interface SchemaOffer {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    url: string;
    priceValidUntil: string;
};

export interface SchemaProduct {
    "@context": "http://schema.org";
    "@type": "Product";
    name: string;
    url: string;
    brand?: string;
    image?: string;
    offers: SchemaOffer,
    gtin?: string;
    gtin12?: string;
    gtin13?: string;
    gtin14?: string;
    gtin8?: string;
    sku?: string;
};

export interface SchemaOrganization {
    "@context": "http://schema.org";
    "@type": "Organization";
    "@id": string;
    url: string;
    name: string;
    logo: string;

};

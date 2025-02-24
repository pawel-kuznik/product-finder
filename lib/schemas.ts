export interface SchemaOffer {
    "@context": "http://schema.org";
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    url: string;
    priceValidUntil: string;
    availability?: SchemaItemAvailability;
};

export interface SchemaProduct {
    "@context": "http://schema.org";
    "@type": "Product";
    name: string;
    url: string;
    brand?: SchemaBrand;
    image?: string;
    offers: SchemaOffer,
    gtin?: string;
    gtin12?: string;
    gtin13?: string;
    gtin14?: string;
    gtin8?: string;
    sku?: string;
};

export interface SchemaBrand {
    "@context": "http://schema.org";
    "@type": "Brand";
    name: string;
};

export interface SchemaOrganization {
    "@context": "http://schema.org";
    "@type": "Organization";
    "@id": string;
    url: string;
    name: string;
    logo: string;
};

export enum SchemaItemAvailability {
    BackOrder = "http://schema.org/BackOrder",
    Discontinued = "http://schema.org/Discontinued",
    InStock = "http://schema.org/InStock",
    InStoreOnly = "http://schema.org/InStoreOnly",
    LimitedAvailability = "http://schema.org/LimitedAvailability",
    MadeToOrder = "http://schema.org/MadeToOrder",
    OnlineOnly = "http://schema.org/OnlineOnly",
    OutOfStock = "http://schema.org/OutOfStock",
    PreOrder = "http://schema.org/PreOrder",
    PreSale = "http://schema.org/PreSale",
    Reserved = "http://schema.org/Reserved",
    SoldOut = "http://schema.org/SoldOut",
};

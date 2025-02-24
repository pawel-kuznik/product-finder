import { ProductResult } from "./ProductResult";
import { SchemaProduct } from "./schemas";

/**
 *  This is a class that will look for products in a JSON string. The class
 *  looks for objects annotated like schema.org Product objects.
 */
export class JSONSeeker {

    /**
     *  @throws Error   When JSON is not parsed correctly it can throw.
     */
    find(input: string) : ProductResult[] {

        const products: ProductResult[] = [];

        const data = JSON.parse(input);

        // sometimes websites put a single object as product in the script tag,
        // but sometimes all of the meta data is bundled in one array.
        if (Array.isArray(data)) data.forEach(n => products.push(...this.delve(n)));
        else products.push(...this.delve(data));

        return products;
    }

    private delve(suspect: object) : ProductResult[] {

        if ("@type" in suspect && suspect["@type"] === "Product") return [ {
            timestamp: new Date().getTime(),
            productSchema: (suspect as SchemaProduct)
        } ];

        return [];
    }
};

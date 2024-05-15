import { SchemaProduct } from "./schemas";

export class JSONSeeker {

    find(input: string) : SchemaProduct[] {

        const products: SchemaProduct[] = [];

        const data = JSON.parse(input);

        // sometimes websites put a single object as product in the script tag,
        // but sometimes all of the meta data is bundled in one array.
        if (Array.isArray(data)) data.forEach(n => products.push(...this.delve(n)));
        else products.push(...this.delve(data));

        return products;
    }

    private delve(suspect: object) : SchemaProduct[] {

        if ("@type" in suspect && suspect["@type"] === "Product") return [ suspect as SchemaProduct ];

        return [];
    }
};

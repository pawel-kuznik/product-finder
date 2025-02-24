import { SchemaProduct } from "./schemas";

/**
 *  This is an interface that describes a result of found product.
 */
export interface ProductResult {
    timestamp: number;
    productSchema: SchemaProduct;
};
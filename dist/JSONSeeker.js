"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSeeker = void 0;
class JSONSeeker {
    find(input) {
        const products = [];
        const data = JSON.parse(input);
        // sometimes websites put a single object as product in the script tag,
        // but sometimes all of the meta data is bundled in one array.
        if (Array.isArray(data))
            data.forEach(n => products.push(...this.delve(n)));
        else
            products.push(...this.delve(data));
        return products;
    }
    delve(suspect) {
        if ("@type" in suspect && suspect["@type"] === "Product")
            return [suspect];
        return [];
    }
}
exports.JSONSeeker = JSONSeeker;
;

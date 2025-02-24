const fs = require("fs");
const path = require("path");
import { WebsiteSeeker } from "./WebsiteSeeker";

describe("WebsiteSeeker", () => {

    it('should find a single product in a script tag', () => {

        const testData = fs.readFileSync(path.resolve(__dirname, '../test_data/test_1.html')).toString("utf-8");

        const seeker = new WebsiteSeeker();

        const products = seeker.find(testData);

        expect(products.length).toEqual(1);
        expect(products[0].productSchema).toHaveProperty("name", "Product");
    });

    it('should find a product from array in a script tag', () => {

        const testData = fs.readFileSync(path.resolve(__dirname, '../test_data/test_2.html')).toString("utf-8");

        const seeker = new WebsiteSeeker();

        const products = seeker.find(testData);

        expect(products.length).toEqual(1);
        expect(products[0].productSchema).toHaveProperty("name", "Product");
    });
});
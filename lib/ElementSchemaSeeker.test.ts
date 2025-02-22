const fs = require("fs");
const path = require("path");
import parse from "node-html-parser";
import { ElementSchemaSeeker } from "./ElementSchemaSeeker";

describe("ElementSchemaSeeker", () => {
    it("should find a product in passed element", () => {

        const testDataString = fs.readFileSync(path.resolve(__dirname, '../test_data/test_3.html')).toString("utf-8");
        const dom = parse(testDataString);

        const suspectElement = dom.querySelector("div[itemscope]");
        if (!suspectElement) throw Error("Test data don't have required element");

        const seeker = new ElementSchemaSeeker();
        const products = seeker.find(suspectElement);

        console.log(products);

        expect(products).toHaveLength(1);

        const product = products[0];

        expect(product.name).toEqual("Product");
        expect(product.brand).toEqual("Brand");
    });
});
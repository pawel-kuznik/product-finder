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

        expect(products).toHaveLength(1);

        const product = products[0];

        expect(product.name).toEqual("Product");
        expect(product.brand).toEqual("Brand");
        expect(product).toHaveProperty("offers");
        expect(product.offers.price).toEqual("3.00");
        expect(product.offers.priceCurrency).toEqual("EUR");
    });

    it("should find a GTIN8, GTIN12, GTIN13, GTIN14", () => {

        const testDataString = fs.readFileSync(path.resolve(__dirname, '../test_data/test_3.html')).toString("utf-8");
        const dom = parse(testDataString);

        const suspectElement = dom.querySelector("div[itemscope]");
        if (!suspectElement) throw Error("Test data don't have required element");

        const seeker = new ElementSchemaSeeker();
        const products = seeker.find(suspectElement);

        expect(products).toHaveLength(1);

        const product = products[0];

        expect(product.gtin).toEqual("gtinnumber");
        expect(product.gtin8).toEqual("12345678");
        expect(product.gtin12).toEqual("1234567891012");
        expect(product.gtin13).toEqual("12345678910123");
        expect(product.gtin14).toEqual("123456789101234");
    });
});
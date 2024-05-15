"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UrlDiscoverer_1 = require("./UrlDiscoverer");
const fs = require("fs");
const path = require("path");
describe("UrlDiscoverer", () => {
    it('should discover links starting with https://', () => {
        const testData = fs.readFileSync(path.resolve(__dirname, '../test_data/test_1.html')).toString("utf-8");
        const discoverer = new UrlDiscoverer_1.UrlDiscoverer("http://example.com");
        discoverer.scan(testData);
        expect(discoverer.found.length).toBeGreaterThan(0);
    });
});

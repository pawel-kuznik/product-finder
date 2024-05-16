import { UrlDiscoverer } from "./UrlDiscoverer";

const fs = require("fs");
const path = require("path");

describe("UrlDiscoverer", () => {
    it('should discover links starting with https://', () => {

        const testData = fs.readFileSync(path.resolve(__dirname, '../test_data/test_1.html')).toString("utf-8");

        const discoverer = new UrlDiscoverer("http://example.com");
        discoverer.scan(testData);

        expect(discoverer.found.length).toBeGreaterThan(0);
    });

    it('should exclude links that match the blacklist', () => {

        const testData = fs.readFileSync(path.resolve(__dirname, '../test_data/test_1.html')).toString("utf-8");

        const discoverer = new UrlDiscoverer("http://example.com");
        discoverer.setBlacklist([ /\/account\// ]);
        discoverer.scan(testData);

        expect(discoverer.found.length).toBeGreaterThan(0);

        expect(discoverer.found).toEqual(expect.not.arrayContaining([ "https://example.com/account/" ]));
    });

    it('should skip any unwanted links from the discovery', () => {

        const testData = fs.readFileSync(path.resolve(__dirname, '../test_data/test_1.html')).toString("utf-8");

        const discoverer = new UrlDiscoverer("http://example.com");
        discoverer.scan(testData);

        expect(discoverer.found.length).toBeGreaterThan(0);

        expect(discoverer.found).toEqual(expect.not.arrayContaining([ "mailto:user@exmaple.com" ]));
        expect(discoverer.found).toEqual(expect.not.arrayContaining([ "ftp://data.exmaple.com/" ]));
    });
});
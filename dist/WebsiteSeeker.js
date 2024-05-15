"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteSeeker = void 0;
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const JSONSeeker_1 = require("./JSONSeeker");
class WebsiteSeeker {
    find(suspectedHtml) {
        const dom = (0, node_html_parser_1.default)(suspectedHtml);
        const scripts = dom.querySelectorAll('script[type="application/ld+json"]');
        const products = [];
        scripts.map(s => {
            const jsonSeeker = new JSONSeeker_1.JSONSeeker();
            products.push(...jsonSeeker.find(s.innerText.toString()));
        });
        return products;
    }
}
exports.WebsiteSeeker = WebsiteSeeker;
;

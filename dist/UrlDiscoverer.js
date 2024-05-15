"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlDiscoverer = void 0;
const url = require("url");
const node_html_parser_1 = __importDefault(require("node-html-parser"));
class UrlDiscoverer {
    get found() { return [...this._found]; }
    constructor(entry) {
        this._blacklist = [];
        this._found = new Set();
        const allowedDomain = url.parse(entry).hostname;
        this._allowedDomain = allowedDomain;
    }
    scanRemote(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(target, { redirect: "follow" });
            if (!response.ok)
                console.log("ERROR");
            const html = yield response.text();
            this.scan(html);
        });
    }
    scan(html) {
        const dom = (0, node_html_parser_1.default)(html);
        const links = dom.querySelectorAll(`a[href^="http://${this._allowedDomain}"], a[href^="https://${this._allowedDomain}"]`);
        for (let a of links) {
            const link = a.getAttribute("href");
            if (!link)
                continue;
            let blacklistHit = false;
            this._blacklist.forEach(r => blacklistHit = blacklistHit || r.test(link));
            if (blacklistHit)
                continue;
            this._found.add(link);
        }
    }
    setBlacklist(regexes) {
        this._blacklist = regexes;
    }
}
exports.UrlDiscoverer = UrlDiscoverer;
;

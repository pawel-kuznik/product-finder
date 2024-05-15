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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
const url = require("url");
const UrlDiscoverer_1 = require("./UrlDiscoverer");
const WebsiteSeeker_1 = require("./WebsiteSeeker");
const delay_1 = require("./delay");
class Source {
    get links() { return this._urlDiscoverer.found; }
    get products() { return this._products; }
    get organization() { return this._organization; }
    constructor(target) {
        this._entryUrl = '';
        this._processed = new Set();
        this._products = new Set();
        this._entryUrl = target;
        this._urlDiscoverer = new UrlDiscoverer_1.UrlDiscoverer(target);
    }
    toJSON() {
        return {
            organization: this._organization,
            products: [...this._products],
            links: this._urlDiscoverer.found
        };
    }
    setBlacklist(regexes) {
        this._urlDiscoverer.setBlacklist(regexes);
    }
    process(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._urlDiscoverer.found.length === this._processed.size && this._processed.size === 0)
                yield this.initialStep(progress);
            yield this.step(progress);
        });
    }
    initialStep(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._urlDiscoverer.scanRemote(this._entryUrl);
            this._processed.add(this._entryUrl);
            progress(`Processing ${this._entryUrl} and discovered ${this._urlDiscoverer.found.length}`, this);
        });
    }
    ;
    step(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const remaining = this._urlDiscoverer.found.filter(l => !this._processed.has(l));
            const next = remaining.shift();
            if (!next)
                return;
            this._processed.add(next);
            const respose = yield fetch(next, { redirect: "follow" });
            const body = yield respose.text();
            const websiteSeeker = new WebsiteSeeker_1.WebsiteSeeker();
            const products = websiteSeeker.find(body);
            for (let product of products) {
                this._products.add(product);
            }
            this._urlDiscoverer.scan(body);
            progress(`Discovered ${products.length} products. Remaining ${remaining.length}} links. ETA in ${eta(remaining.length)} minutes`, this);
            yield (0, delay_1.delay)(() => this.step(progress), 500);
        });
    }
}
exports.Source = Source;
;
function eta(count) {
    return String(count * 500 / 1000 / 60);
}

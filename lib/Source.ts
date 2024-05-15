const url = require("url");
import { UrlDiscoverer } from "./UrlDiscoverer";
import { WebsiteSeeker } from "./WebsiteSeeker";
import { SchemaOrganization, SchemaProduct } from "./schemas";
import { delay } from "./delay";

export type SourceProgressCallback = (message: string, source: Source) => void;

export class Source {

    private _entryUrl: string = '';

    private _urlDiscoverer: UrlDiscoverer;

    private _processed: Set<string> = new Set();

    private _products: Set<SchemaProduct> = new Set();
    private _organization: SchemaOrganization|undefined;

    get links() { return this._urlDiscoverer.found; }
    get products() { return this._products; }
    get organization() { return this._organization; }

    constructor(target: string) {
        this._entryUrl = target;
        this._urlDiscoverer = new UrlDiscoverer(target)
    }

    toJSON() {
        return {
            organization: this._organization,
            products: [...this._products],
            links: this._urlDiscoverer.found
        }
    }

    setBlacklist(regexes: RegExp[]) {
        
        this._urlDiscoverer.setBlacklist(regexes);
    }

    async process(progress: SourceProgressCallback) {

        if (this._urlDiscoverer.found.length === this._processed.size && this._processed.size === 0) await this.initialStep(progress);

        await this.step(progress);    
    }

    private async initialStep(progress: SourceProgressCallback) {

        await this._urlDiscoverer.scanRemote(this._entryUrl);
        this._processed.add(this._entryUrl);

        progress(`Processing ${this._entryUrl} and discovered ${this._urlDiscoverer.found.length}`, this);
    };

    private async step(progress: SourceProgressCallback) {

        const remaining = this._urlDiscoverer.found.filter(l => !this._processed.has(l));
        const next = remaining.shift();

        if (!next) return;

        this._processed.add(next);

        const respose = await fetch(next, { redirect: "follow" });
        const body = await respose.text();

        const websiteSeeker = new WebsiteSeeker();
        const products = websiteSeeker.find(body);

        for (let product of products) {
            this._products.add(product);
        }

        this._urlDiscoverer.scan(body);

        progress(`Discovered ${products.length} products. Remaining ${remaining.length}} links. ETA in ${eta(remaining.length)} minutes`, this);

        await delay(() => this.step(progress), 500);
    }
};


function eta(count: number) {
    return String(count * 500 / 1000 / 60);
}
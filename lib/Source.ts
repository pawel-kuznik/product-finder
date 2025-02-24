import { UrlDiscoverer } from "./UrlDiscoverer";
import { WebsiteSeeker } from "./WebsiteSeeker";
import { SchemaOrganization } from "./schemas";
import { delay } from "./delay";
import { ProductResult } from "./ProductResult";

/**
 *  When source processes a link a callback is called.
 */
export type SourceProgressCallback = (message: string, source: Source) => void;

/**
 *  A data source that represents a website of a shop. This class allows for processing
 *  the source and getting possible links to process later on or access to discovered
 *  products.
 * 
 *  After the processing is done the source can be serialized to JSON for later use
 *  or continued processing.
 */
export class Source {

    private _entryUrl: string = '';
    private _urlDiscoverer: UrlDiscoverer;
    private _processed: Set<string> = new Set();
    private _products: Set<ProductResult> = new Set();
    private _organization: SchemaOrganization|undefined;

    get links() { return this._urlDiscoverer.found; }
    get products() { return this._products; }
    get organization() { return this._organization; }

    constructor(target: string) {
        this._entryUrl = target;
        this._urlDiscoverer = new UrlDiscoverer(target)
    }

    /**
     *  Serialize the Source into a JSON data.
     */
    toJSON() {
        return {
            organization: this._organization,
            products: [...this._products],
            links: this._urlDiscoverer.found
        }
    }

    /**
     *  Set a blacklist of links to exclude from processing. This is useful for excluding links that lead
     *  to parts of website that are known to not produce any products data (like account, comments, or so on). 
     */
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
};
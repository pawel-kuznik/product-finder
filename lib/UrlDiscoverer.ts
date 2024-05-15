const url = require("url");
import parse from "node-html-parser";

export class UrlDiscoverer {

    private _allowedDomain: string;
    private _blacklist: RegExp[] = [];

    private _found: Set<string> = new Set();

    get found() : string[] { return [ ...this._found ]; }

    constructor(entry: string) {

        const allowedDomain = url.parse(entry).hostname;

        this._allowedDomain = allowedDomain;
    }

    async scanRemote(target: string) : Promise<void> {
        
        const response = await fetch(target, { redirect: "follow" });

        if (!response.ok) console.log("ERROR");

        const html = await response.text();

        this.scan(html);
    }

    scan(html: string) {

        const dom = parse(html);

        const links = dom.querySelectorAll(`a[href^="http://${this._allowedDomain}"], a[href^="https://${this._allowedDomain}"]`);

        for (let a of links) {

            const link = a.getAttribute("href");

            if (!link) continue;

            let blacklistHit = false;

            this._blacklist.forEach(r => blacklistHit = blacklistHit || r.test(link));

            if (blacklistHit) continue;
                
            this._found.add(link);
        }
    }

    setBlacklist(regexes: RegExp[]) {

        this._blacklist = regexes;
    }
};

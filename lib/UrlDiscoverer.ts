const url = require("url");
import parse from "node-html-parser";
import robotsParser, { Robot } from "robots-parser";

/**
 *  The UrlDiscoverer can scan html content and look for links that later
 *  on can be followed. This is useful when a whole shop needs to be scanned
 *  for products and it can be automated.
 * 
 *  However, sometimes we don't want to scan all links cause we can make
 *  a determination that they don't lead to any products (like account, comments,
 *  etc). To skip them a set of regexpressions can be set via the .setBlacklist()
 *  method to exclude certain links from discovery.
 * 
 *  NOTE: The UrlDiscoverer only works with absolute links. It's a drawback, but
 *  many websites out there already canonize theirs links, so in general it shouldn't
 *  be a big problem. Maybe.
 */
export class UrlDiscoverer {

    private _allowedDomain: string;
    private _blacklist: RegExp[] = [];
    private _robots: Robot|null = null;

    private _found: Set<string> = new Set();

    get found() : string[] { return [ ...this._found ]; }

    /**
     *  Construct the discoverer.
     *  @throw Error    When the entry is somehow invalid it will not allow for
     *                  the instance to be constructed. 
     */
    constructor(entry: string) {

        const allowedDomain = url.parse(entry).hostname;
        if (!allowedDomain) throw Error(`Invalid start entry passed: ${entry}`);

        this._allowedDomain = allowedDomain;
    }

    /**
     *  Scan a remote content for urls.
     */
    async scanRemote(target: string) : Promise<void> {
        
        const response = await fetch(target, { redirect: "follow" });

        // @todo better error reporting
        if (!response.ok) console.log("ERROR");

        const html = await response.text();

        this.scan(html);
    }

    /**
     *  Scan a passed content.
     */
    scan(html: string) {

        const dom = parse(html);

        // discover only links that lead to the same domain. We don't want to crawl
        // the whole internet, but a very specific shop. We also want to have only
        // http: and https: links discovered. This will make sure that we don't include
        // ftp: or mailto: links.
        const links = dom.querySelectorAll(`a[href^="http://${this._allowedDomain}"], a[href^="https://${this._allowedDomain}"], a[href^="/"]`);

        for (let a of links) {

            const rawLink = a.getAttribute("href");
            if (!rawLink) continue;

            // an easy way to deal with relative links is to see if it starts with "/"
            // and if so, we can just prepend the allowed domain to it as we assume
            // that the allowed domains is the defacto base domain.
            const link = rawLink.startsWith("/") ? `http://${this._allowedDomain}${rawLink}` : rawLink;

            // check if when we have robots.txt file we should skip this link
            if (this._robots && this._robots.isDisallowed(link, "*")) continue;
            
            let blacklistHit = false;
            this._blacklist.forEach(r => blacklistHit = blacklistHit || r.test(link));

            if (blacklistHit) continue;
                
            this._found.add(link);
        }
    }

    /**
     *  Set a blacklist that will exclude links from discovery.
     */
    setBlacklist(regexes: RegExp[]) {

        this._blacklist = regexes;
    }

    /**
     *  Set a robot.txt file that should be used to determine if links should be
     *  discovered or not.
     */
    setRobotTxt(baseUrl: string, robotsTxt: string) {

        this._robots = robotsParser(baseUrl, robotsTxt);
    }   
};

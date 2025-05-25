/**
 *  This is a tool that can take an URL and try to find all products
 *  under a given URL.
 */

import { UrlDiscoverer } from "../UrlDiscoverer";

const args = process.argv.slice(2);

const url = new URL(args[0]);

const seeker = new UrlDiscoverer(url.toString());

seeker.scanRemote(url.toString()).then(() => {
    console.log(seeker.found);
});

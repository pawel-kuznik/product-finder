/**
 *  This is a tool that can take an URL and try to find all products
 *  under a given URL.
 */

import { UrlSeeker } from "../UrlSeeker";

const args = process.argv.slice(2);

const seeker = new UrlSeeker();

seeker.find(args[0]).then(results => {
    console.log(results);
});
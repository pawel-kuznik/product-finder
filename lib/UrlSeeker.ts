import { WebsiteSeeker } from "./WebsiteSeeker";
import { SchemaProduct } from "./schemas";

export class UrlSeeker {

    async find(url: string) : Promise<SchemaProduct[]> {

        const response = await fetch(url, { redirect: "follow" });
        const html = await response.text(); 

        const websiteSeeker = new WebsiteSeeker();

        return websiteSeeker.find(html);
    }
};

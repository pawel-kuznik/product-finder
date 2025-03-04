import { HTMLElement } from "node-html-parser";

export function testForSchemaType(input: HTMLElement, schemaType: string) {

    const itemtype = input.getAttribute("itemtype");
    const httpSchema = `http://schema.org/${schemaType}`;
    const httpsSchema = `https://schema.org/${schemaType}`;

    return itemtype === httpSchema || itemtype === httpsSchema;
}
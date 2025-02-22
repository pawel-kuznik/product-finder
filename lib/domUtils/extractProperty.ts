import { HTMLElement } from "node-html-parser";

export function extractProperty(target: HTMLElement) : string {

    // some props might be expressed as LINK tags. In this case we want to look for href
    // attribute.
    if (target.tagName === "LINK") return (target.getAttribute("href") || "").trim();

    //  try to first get content attribute. This is the one that is used in conjunction
    //  with <meta> tags. In most of the cases it will be either the innerText of
    //  the content attribute value, but it's better to keep an eye for more exotic places
    //  where the property value could be. 
    const content = target.getAttribute("content");
    return (content ? content : target.innerText).trim();
}
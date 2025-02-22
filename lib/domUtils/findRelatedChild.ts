import { HTMLElement } from "node-html-parser";

export function findRelatedChild(parent: HTMLElement, parentSelector: string, childSelector: string) : HTMLElement|null {

    const children = parent.querySelectorAll(childSelector);
    if (!children) return null;

    for (let child of children) {

        // The following is to make sure that we are tackling the nearest child.
        // While in more conventional DOM environment we could just use an equality
        // operator, with out nore-dom-parser we can't do it. The parser doesn't
        // use references to objects and creates copies on each query.
        const confirmParent = child.closest(parentSelector);
        if (parent.outerHTML != confirmParent?.outerHTML) continue;

        return child;
    }

    return null;
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
function delay(callback, t) {
    return new Promise(resolve => setTimeout(() => { resolve(callback()); }, t));
}
exports.delay = delay;
;

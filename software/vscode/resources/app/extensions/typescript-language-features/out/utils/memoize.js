"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
function memoize(_target, key, descriptor) {
    let fnKey = undefined;
    let fn = undefined;
    if (typeof descriptor.value === 'function') {
        fnKey = 'value';
        fn = descriptor.value;
    }
    else if (typeof descriptor.get === 'function') {
        fnKey = 'get';
        fn = descriptor.get;
    }
    else {
        throw new Error('not supported');
    }
    const memoizeKey = `$memoize$${key}`;
    descriptor[fnKey] = function (...args) {
        if (!this.hasOwnProperty(memoizeKey)) {
            Object.defineProperty(this, memoizeKey, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: fn.apply(this, args)
            });
        }
        return this[memoizeKey];
    };
}
exports.memoize = memoize;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\typescript-language-features\out/utils\memoize.js.map

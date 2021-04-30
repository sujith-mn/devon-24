"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = 'file';
exports.untitled = 'untitled';
exports.walkThroughSnippet = 'walkThroughSnippet';
exports.supportedSchemes = [
    exports.file,
    exports.untitled,
    exports.walkThroughSnippet
];
function isSupportedScheme(scheme) {
    return exports.supportedSchemes.indexOf(scheme) >= 0;
}
exports.isSupportedScheme = isSupportedScheme;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\typescript-language-features\out/utils\fileSchemes.js.map

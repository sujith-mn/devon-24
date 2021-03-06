"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const markdownEngine_1 = require("../markdownEngine");
function createNewMarkdownEngine() {
    return new markdownEngine_1.MarkdownEngine(new class {
        constructor() {
            this.previewScripts = [];
            this.previewStyles = [];
            this.previewResourceRoots = [];
            this.markdownItPlugins = [];
        }
    });
}
exports.createNewMarkdownEngine = createNewMarkdownEngine;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\markdown-language-features\out/test\engine.js.map

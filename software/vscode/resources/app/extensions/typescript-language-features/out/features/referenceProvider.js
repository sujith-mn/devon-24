"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const typeConverters = require("../utils/typeConverters");
class TypeScriptReferenceSupport {
    constructor(client) {
        this.client = client;
    }
    async provideReferences(document, position, options, token) {
        const filepath = this.client.normalizePath(document.uri);
        if (!filepath) {
            return [];
        }
        const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
        try {
            const msg = await this.client.execute('references', args, token);
            if (!msg.body) {
                return [];
            }
            const result = [];
            const has203Features = this.client.apiVersion.has203Features();
            for (const ref of msg.body.refs) {
                if (!options.includeDeclaration && has203Features && ref.isDefinition) {
                    continue;
                }
                const url = this.client.asUrl(ref.file);
                const location = typeConverters.Location.fromTextSpan(url, ref);
                result.push(location);
            }
            return result;
        }
        catch (_a) {
            return [];
        }
    }
}
exports.default = TypeScriptReferenceSupport;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\typescript-language-features\out/features\referenceProvider.js.map

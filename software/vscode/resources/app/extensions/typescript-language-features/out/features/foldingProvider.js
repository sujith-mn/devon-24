"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const typeConverters = require("../utils/typeConverters");
class TypeScriptFoldingProvider {
    constructor(client) {
        this.client = client;
    }
    async provideFoldingRanges(document, _context, token) {
        if (!this.client.apiVersion.has280Features()) {
            return;
        }
        const file = this.client.normalizePath(document.uri);
        if (!file) {
            return;
        }
        const args = { file };
        const response = await this.client.execute('getOutliningSpans', args, token);
        if (!response || !response.body) {
            return;
        }
        return response.body.map(span => {
            const range = typeConverters.Range.fromTextSpan(span.textSpan);
            // workaround for #47240
            if (range.end.character > 0 && document.getText(new vscode.Range(range.end.translate(0, -1), range.end)) === '}') {
                return new vscode.FoldingRange(range.start.line, Math.max(range.end.line - 1, range.start.line));
            }
            return new vscode.FoldingRange(range.start.line, range.end.line);
        });
    }
}
exports.default = TypeScriptFoldingProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\typescript-language-features\out/features\foldingProvider.js.map

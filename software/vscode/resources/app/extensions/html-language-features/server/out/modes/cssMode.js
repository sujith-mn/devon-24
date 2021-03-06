/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var languageModelCache_1 = require("../languageModelCache");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var vscode_css_languageservice_1 = require("vscode-css-languageservice");
var embeddedSupport_1 = require("./embeddedSupport");
function getCSSMode(documentRegions, workspace) {
    var cssLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
    var embeddedCSSDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return documentRegions.get(document).getEmbeddedDocument('css'); });
    var cssStylesheets = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return cssLanguageService.parseStylesheet(document); });
    return {
        getId: function () {
            return 'css';
        },
        doValidation: function (document, settings) {
            if (settings === void 0) { settings = workspace.settings; }
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.doValidation(embedded, cssStylesheets.get(embedded), settings && settings.css);
        },
        doComplete: function (document, position, settings) {
            if (settings === void 0) { settings = workspace.settings; }
            var embedded = embeddedCSSDocuments.get(document);
            var stylesheet = cssStylesheets.get(embedded);
            return cssLanguageService.doComplete(embedded, position, stylesheet) || vscode_languageserver_types_1.CompletionList.create();
        },
        doHover: function (document, position) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.doHover(embedded, position, cssStylesheets.get(embedded));
        },
        findDocumentHighlight: function (document, position) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findDocumentHighlights(embedded, position, cssStylesheets.get(embedded));
        },
        findDocumentSymbols: function (document) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findDocumentSymbols(embedded, cssStylesheets.get(embedded)).filter(function (s) { return s.name !== embeddedSupport_1.CSS_STYLE_RULE; });
        },
        findDefinition: function (document, position) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findDefinition(embedded, position, cssStylesheets.get(embedded));
        },
        findReferences: function (document, position) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findReferences(embedded, position, cssStylesheets.get(embedded));
        },
        findDocumentColors: function (document) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.findDocumentColors(embedded, cssStylesheets.get(embedded));
        },
        getColorPresentations: function (document, color, range) {
            var embedded = embeddedCSSDocuments.get(document);
            return cssLanguageService.getColorPresentations(embedded, cssStylesheets.get(embedded), color, range);
        },
        getFoldingRanges: function (document, range) {
            var embedded = embeddedCSSDocuments.get(document);
            var ranges = cssLanguageService.getFoldingRanges(embedded, {});
            return ranges.filter(function (r) { return r.startLine >= range.start.line && r.endLine < range.end.line; });
        },
        onDocumentRemoved: function (document) {
            embeddedCSSDocuments.onDocumentRemoved(document);
            cssStylesheets.onDocumentRemoved(document);
        },
        dispose: function () {
            embeddedCSSDocuments.dispose();
            cssStylesheets.dispose();
        }
    };
}
exports.getCSSMode = getCSSMode;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\html-language-features\server\out/modes\cssMode.js.map

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_1 = require("vscode-languageserver");
var languageModes_1 = require("./modes/languageModes");
var formatting_1 = require("./modes/formatting");
var arrays_1 = require("./utils/arrays");
var documentContext_1 = require("./utils/documentContext");
var vscode_uri_1 = require("vscode-uri");
var runner_1 = require("./utils/runner");
var vscode_languageserver_protocol_foldingprovider_1 = require("vscode-languageserver-protocol-foldingprovider");
var htmlFolding_1 = require("./modes/htmlFolding");
var TagCloseRequest;
(function (TagCloseRequest) {
    TagCloseRequest.type = new vscode_languageserver_1.RequestType('html/tag');
})(TagCloseRequest || (TagCloseRequest = {}));
// Create a connection for the server
var connection = vscode_languageserver_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
process.on('unhandledRejection', function (e) {
    console.error(runner_1.formatError("Unhandled exception", e));
});
process.on('uncaughtException', function (e) {
    console.error(runner_1.formatError("Unhandled exception", e));
});
// Create a simple text document manager. The text document manager
// supports full document sync only
var documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
var workspaceFolders = [];
var languageModes;
var clientSnippetSupport = false;
var clientDynamicRegisterSupport = false;
var scopedSettingsSupport = false;
var workspaceFoldersSupport = false;
var foldingRangeLimit = Number.MAX_VALUE;
var globalSettings = {};
var documentSettings = {};
// remove document settings on close
documents.onDidClose(function (e) {
    delete documentSettings[e.document.uri];
});
function getDocumentSettings(textDocument, needsDocumentSettings) {
    if (scopedSettingsSupport && needsDocumentSettings()) {
        var promise = documentSettings[textDocument.uri];
        if (!promise) {
            var scopeUri = textDocument.uri;
            var configRequestParam = { items: [{ scopeUri: scopeUri, section: 'css' }, { scopeUri: scopeUri, section: 'html' }, { scopeUri: scopeUri, section: 'javascript' }] };
            promise = connection.sendRequest(vscode_languageserver_1.ConfigurationRequest.type, configRequestParam).then(function (s) { return ({ css: s[0], html: s[1], javascript: s[2] }); });
            documentSettings[textDocument.uri] = promise;
        }
        return promise;
    }
    return Promise.resolve(void 0);
}
// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities
connection.onInitialize(function (params) {
    var initializationOptions = params.initializationOptions;
    workspaceFolders = params.workspaceFolders;
    if (!Array.isArray(workspaceFolders)) {
        workspaceFolders = [];
        if (params.rootPath) {
            workspaceFolders.push({ name: '', uri: vscode_uri_1.default.file(params.rootPath).toString() });
        }
    }
    var workspace = {
        get settings() { return globalSettings; },
        get folders() { return workspaceFolders; }
    };
    languageModes = languageModes_1.getLanguageModes(initializationOptions ? initializationOptions.embeddedLanguages : { css: true, javascript: true }, workspace);
    documents.onDidClose(function (e) {
        languageModes.onDocumentRemoved(e.document);
    });
    connection.onShutdown(function () {
        languageModes.dispose();
    });
    function getClientCapability(name, def) {
        var keys = name.split('.');
        var c = params.capabilities;
        for (var i = 0; c && i < keys.length; i++) {
            if (!c.hasOwnProperty(keys[i])) {
                return def;
            }
            c = c[keys[i]];
        }
        return c;
    }
    clientSnippetSupport = getClientCapability('textDocument.completion.completionItem.snippetSupport', false);
    clientDynamicRegisterSupport = getClientCapability('workspace.symbol.dynamicRegistration', false);
    scopedSettingsSupport = getClientCapability('workspace.configuration', false);
    workspaceFoldersSupport = getClientCapability('workspace.workspaceFolders', false);
    foldingRangeLimit = getClientCapability('textDocument.foldingRange.rangeLimit', Number.MAX_VALUE);
    var capabilities = {
        // Tell the client that the server works in FULL text document sync mode
        textDocumentSync: documents.syncKind,
        completionProvider: clientSnippetSupport ? { resolveProvider: true, triggerCharacters: ['.', ':', '<', '"', '=', '/'] } : undefined,
        hoverProvider: true,
        documentHighlightProvider: true,
        documentRangeFormattingProvider: false,
        documentLinkProvider: { resolveProvider: false },
        documentSymbolProvider: true,
        definitionProvider: true,
        signatureHelpProvider: { triggerCharacters: ['('] },
        referencesProvider: true,
        colorProvider: true,
        foldingRangeProvider: true
    };
    return { capabilities: capabilities };
});
connection.onInitialized(function (p) {
    if (workspaceFoldersSupport) {
        connection.client.register(vscode_languageserver_1.DidChangeWorkspaceFoldersNotification.type);
        connection.onNotification(vscode_languageserver_1.DidChangeWorkspaceFoldersNotification.type, function (e) {
            var toAdd = e.event.added;
            var toRemove = e.event.removed;
            var updatedFolders = [];
            if (workspaceFolders) {
                var _loop_1 = function (folder) {
                    if (!toRemove.some(function (r) { return r.uri === folder.uri; }) && !toAdd.some(function (r) { return r.uri === folder.uri; })) {
                        updatedFolders.push(folder);
                    }
                };
                for (var _i = 0, workspaceFolders_1 = workspaceFolders; _i < workspaceFolders_1.length; _i++) {
                    var folder = workspaceFolders_1[_i];
                    _loop_1(folder);
                }
            }
            workspaceFolders = updatedFolders.concat(toAdd);
            documents.all().forEach(triggerValidation);
        });
    }
});
var formatterRegistration = null;
// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration(function (change) {
    globalSettings = change.settings;
    documentSettings = {}; // reset all document settings
    documents.all().forEach(triggerValidation);
    // dynamically enable & disable the formatter
    if (clientDynamicRegisterSupport) {
        var enableFormatter = globalSettings && globalSettings.html && globalSettings.html.format && globalSettings.html.format.enable;
        if (enableFormatter) {
            if (!formatterRegistration) {
                var documentSelector = [{ language: 'html' }, { language: 'handlebars' }]; // don't register razor, the formatter does more harm than good
                formatterRegistration = connection.client.register(vscode_languageserver_1.DocumentRangeFormattingRequest.type, { documentSelector: documentSelector });
            }
        }
        else if (formatterRegistration) {
            formatterRegistration.then(function (r) { return r.dispose(); });
            formatterRegistration = null;
        }
    }
});
var pendingValidationRequests = {};
var validationDelayMs = 500;
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(function (change) {
    triggerValidation(change.document);
});
// a document has closed: clear all diagnostics
documents.onDidClose(function (event) {
    cleanPendingValidation(event.document);
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});
function cleanPendingValidation(textDocument) {
    var request = pendingValidationRequests[textDocument.uri];
    if (request) {
        clearTimeout(request);
        delete pendingValidationRequests[textDocument.uri];
    }
}
function triggerValidation(textDocument) {
    cleanPendingValidation(textDocument);
    pendingValidationRequests[textDocument.uri] = setTimeout(function () {
        delete pendingValidationRequests[textDocument.uri];
        validateTextDocument(textDocument);
    }, validationDelayMs);
}
function isValidationEnabled(languageId, settings) {
    if (settings === void 0) { settings = globalSettings; }
    var validationSettings = settings && settings.html && settings.html.validate;
    if (validationSettings) {
        return languageId === 'css' && validationSettings.styles !== false || languageId === 'javascript' && validationSettings.scripts !== false;
    }
    return true;
}
function validateTextDocument(textDocument) {
    return __awaiter(this, void 0, void 0, function () {
        var version, diagnostics_1, modes_1, settings_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    version = textDocument.version;
                    diagnostics_1 = [];
                    if (!(textDocument.languageId === 'html')) return [3 /*break*/, 2];
                    modes_1 = languageModes.getAllModesInDocument(textDocument);
                    return [4 /*yield*/, getDocumentSettings(textDocument, function () { return modes_1.some(function (m) { return !!m.doValidation; }); })];
                case 1:
                    settings_1 = _a.sent();
                    textDocument = documents.get(textDocument.uri);
                    if (textDocument && textDocument.version === version) { // check no new version has come in after in after the async op
                        modes_1.forEach(function (mode) {
                            if (mode.doValidation && isValidationEnabled(mode.getId(), settings_1)) {
                                arrays_1.pushAll(diagnostics_1, mode.doValidation(textDocument, settings_1));
                            }
                        });
                        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: diagnostics_1 });
                    }
                    _a.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    connection.console.error(runner_1.formatError("Error while validating " + textDocument.uri, e_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
connection.onCompletion(function (textDocumentPosition, token) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        return [2 /*return*/, runner_1.runSafeAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                var document, mode, doComplete, settings, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            document = documents.get(textDocumentPosition.textDocument.uri);
                            mode = languageModes.getModeAtPosition(document, textDocumentPosition.position);
                            if (!mode || !mode.doComplete) {
                                return [2 /*return*/, { isIncomplete: true, items: [] }];
                            }
                            doComplete = mode.doComplete;
                            if (mode.getId() !== 'html') {
                                /* __GDPR__
                                    "html.embbedded.complete" : {
                                        "languageId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                                    }
                                 */
                                connection.telemetry.logEvent({ key: 'html.embbedded.complete', value: { languageId: mode.getId() } });
                            }
                            return [4 /*yield*/, getDocumentSettings(document, function () { return doComplete.length > 2; })];
                        case 1:
                            settings = _a.sent();
                            result = doComplete(document, textDocumentPosition.position, settings);
                            return [2 /*return*/, result];
                    }
                });
            }); }, null, "Error while computing completions for " + textDocumentPosition.textDocument.uri, token)];
    });
}); });
connection.onCompletionResolve(function (item, token) {
    return runner_1.runSafe(function () {
        var data = item.data;
        if (data && data.languageId && data.uri) {
            var mode = languageModes.getMode(data.languageId);
            var document = documents.get(data.uri);
            if (mode && mode.doResolve && document) {
                return mode.doResolve(document, item);
            }
        }
        return item;
    }, item, "Error while resolving completion proposal", token);
});
connection.onHover(function (textDocumentPosition, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(textDocumentPosition.textDocument.uri);
        var mode = languageModes.getModeAtPosition(document, textDocumentPosition.position);
        if (mode && mode.doHover) {
            return mode.doHover(document, textDocumentPosition.position);
        }
        return null;
    }, null, "Error while computing hover for " + textDocumentPosition.textDocument.uri, token);
});
connection.onDocumentHighlight(function (documentHighlightParams, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(documentHighlightParams.textDocument.uri);
        var mode = languageModes.getModeAtPosition(document, documentHighlightParams.position);
        if (mode && mode.findDocumentHighlight) {
            return mode.findDocumentHighlight(document, documentHighlightParams.position);
        }
        return [];
    }, [], "Error while computing document highlights for " + documentHighlightParams.textDocument.uri, token);
});
connection.onDefinition(function (definitionParams, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(definitionParams.textDocument.uri);
        var mode = languageModes.getModeAtPosition(document, definitionParams.position);
        if (mode && mode.findDefinition) {
            return mode.findDefinition(document, definitionParams.position);
        }
        return [];
    }, null, "Error while computing definitions for " + definitionParams.textDocument.uri, token);
});
connection.onReferences(function (referenceParams, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(referenceParams.textDocument.uri);
        var mode = languageModes.getModeAtPosition(document, referenceParams.position);
        if (mode && mode.findReferences) {
            return mode.findReferences(document, referenceParams.position);
        }
        return [];
    }, [], "Error while computing references for " + referenceParams.textDocument.uri, token);
});
connection.onSignatureHelp(function (signatureHelpParms, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(signatureHelpParms.textDocument.uri);
        var mode = languageModes.getModeAtPosition(document, signatureHelpParms.position);
        if (mode && mode.doSignatureHelp) {
            return mode.doSignatureHelp(document, signatureHelpParms.position);
        }
        return null;
    }, null, "Error while computing signature help for " + signatureHelpParms.textDocument.uri, token);
});
connection.onDocumentRangeFormatting(function (formatParams, token) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        return [2 /*return*/, runner_1.runSafeAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                var document, settings, unformattedTags, enabledModes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            document = documents.get(formatParams.textDocument.uri);
                            return [4 /*yield*/, getDocumentSettings(document, function () { return true; })];
                        case 1:
                            settings = _a.sent();
                            if (!settings) {
                                settings = globalSettings;
                            }
                            unformattedTags = settings && settings.html && settings.html.format && settings.html.format.unformatted || '';
                            enabledModes = { css: !unformattedTags.match(/\bstyle\b/), javascript: !unformattedTags.match(/\bscript\b/) };
                            return [2 /*return*/, formatting_1.format(languageModes, document, formatParams.range, formatParams.options, settings, enabledModes)];
                    }
                });
            }); }, [], "Error while formatting range for " + formatParams.textDocument.uri, token)];
    });
}); });
connection.onDocumentLinks(function (documentLinkParam, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(documentLinkParam.textDocument.uri);
        var links = [];
        if (document) {
            var documentContext_2 = documentContext_1.getDocumentContext(document.uri, workspaceFolders);
            languageModes.getAllModesInDocument(document).forEach(function (m) {
                if (m.findDocumentLinks) {
                    arrays_1.pushAll(links, m.findDocumentLinks(document, documentContext_2));
                }
            });
        }
        return links;
    }, [], "Error while document links for " + documentLinkParam.textDocument.uri, token);
});
connection.onDocumentSymbol(function (documentSymbolParms, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(documentSymbolParms.textDocument.uri);
        var symbols = [];
        languageModes.getAllModesInDocument(document).forEach(function (m) {
            if (m.findDocumentSymbols) {
                arrays_1.pushAll(symbols, m.findDocumentSymbols(document));
            }
        });
        return symbols;
    }, [], "Error while computing document symbols for " + documentSymbolParms.textDocument.uri, token);
});
connection.onRequest(vscode_languageserver_1.DocumentColorRequest.type, function (params, token) {
    return runner_1.runSafe(function () {
        var infos = [];
        var document = documents.get(params.textDocument.uri);
        if (document) {
            languageModes.getAllModesInDocument(document).forEach(function (m) {
                if (m.findDocumentColors) {
                    arrays_1.pushAll(infos, m.findDocumentColors(document));
                }
            });
        }
        return infos;
    }, [], "Error while computing document colors for " + params.textDocument.uri, token);
});
connection.onRequest(vscode_languageserver_1.ColorPresentationRequest.type, function (params, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(params.textDocument.uri);
        if (document) {
            var mode = languageModes.getModeAtPosition(document, params.range.start);
            if (mode && mode.getColorPresentations) {
                return mode.getColorPresentations(document, params.color, params.range);
            }
        }
        return [];
    }, [], "Error while computing color presentations for " + params.textDocument.uri, token);
});
connection.onRequest(TagCloseRequest.type, function (params, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(params.textDocument.uri);
        if (document) {
            var pos = params.position;
            if (pos.character > 0) {
                var mode = languageModes.getModeAtPosition(document, vscode_languageserver_1.Position.create(pos.line, pos.character - 1));
                if (mode && mode.doAutoClose) {
                    return mode.doAutoClose(document, pos);
                }
            }
        }
        return null;
    }, null, "Error while computing tag close actions for " + params.textDocument.uri, token);
});
connection.onRequest(vscode_languageserver_protocol_foldingprovider_1.FoldingRangeRequest.type, function (params, token) {
    return runner_1.runSafe(function () {
        var document = documents.get(params.textDocument.uri);
        if (document) {
            return htmlFolding_1.getFoldingRanges(languageModes, document, foldingRangeLimit, token);
        }
        return null;
    }, null, "Error while computing folding regions for " + params.textDocument.uri, token);
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\html-language-features\server\out/htmlServerMain.js.map

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_1 = require("vscode-languageserver");
function formatError(message, err) {
    if (err instanceof Error) {
        var error = err;
        return message + ": " + error.message + "\n" + error.stack;
    }
    else if (typeof err === 'string') {
        return message + ": " + err;
    }
    else if (err) {
        return message + ": " + err.toString();
    }
    return message;
}
exports.formatError = formatError;
function runSafeAsync(func, errorVal, errorMessage, token) {
    return new Promise(function (resolve, reject) {
        setImmediate(function () {
            if (token.isCancellationRequested) {
                resolve(cancelValue());
            }
            return func().then(function (result) {
                if (token.isCancellationRequested) {
                    resolve(cancelValue());
                    return;
                }
                else {
                    resolve(result);
                }
            }, function (e) {
                console.error(formatError(errorMessage, e));
                resolve(errorVal);
            });
        });
    });
}
exports.runSafeAsync = runSafeAsync;
function runSafe(func, errorVal, errorMessage, token) {
    return new Promise(function (resolve, reject) {
        setImmediate(function () {
            if (token.isCancellationRequested) {
                resolve(cancelValue());
            }
            else {
                try {
                    var result = func();
                    if (token.isCancellationRequested) {
                        resolve(cancelValue());
                        return;
                    }
                    else {
                        resolve(result);
                    }
                }
                catch (e) {
                    console.error(formatError(errorMessage, e));
                    resolve(errorVal);
                }
            }
        });
    });
}
exports.runSafe = runSafe;
function cancelValue() {
    console.log('cancelled');
    return new vscode_languageserver_1.ResponseError(vscode_languageserver_1.ErrorCodes.RequestCancelled, 'Request cancelled');
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\json-language-features\server\out/utils\runner.js.map

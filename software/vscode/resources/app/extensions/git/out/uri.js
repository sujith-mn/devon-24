/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function fromGitUri(uri) {
    return JSON.parse(uri.query);
}
exports.fromGitUri = fromGitUri;
// As a mitigation for extensions like ESLint showing warnings and errors
// for git URIs, let's change the file extension of these uris to .git,
// when `replaceFileExtension` is true.
function toGitUri(uri, ref, options = {}) {
    const params = {
        path: uri.fsPath,
        ref
    };
    if (options.submoduleOf) {
        params.submoduleOf = options.submoduleOf;
    }
    let path = uri.path;
    if (options.replaceFileExtension) {
        path = `${path}.git`;
    }
    else if (options.submoduleOf) {
        path = `${path}.diff`;
    }
    return uri.with({
        scheme: 'git',
        path,
        query: JSON.stringify(params)
    });
}
exports.toGitUri = toGitUri;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\git\out/uri.js.map

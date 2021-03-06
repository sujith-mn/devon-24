/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var path = require("path");
var fs = require("fs");
var vscode_uri_1 = require("vscode-uri");
var strings_1 = require("../utils/strings");
var arrays_1 = require("../utils/arrays");
function getPathCompletionParticipant(document, workspaceFolders, result) {
    return {
        onHtmlAttributeValue: function (_a) {
            var tag = _a.tag, position = _a.position, attribute = _a.attribute, valueBeforeCursor = _a.value, range = _a.range;
            var fullValue = stripQuotes(document.getText(range));
            if (shouldDoPathCompletion(tag, attribute, fullValue)) {
                if (workspaceFolders.length === 0) {
                    return;
                }
                var workspaceRoot = resolveWorkspaceRoot(document, workspaceFolders);
                var paths = providePaths(valueBeforeCursor, vscode_uri_1.default.parse(document.uri).fsPath, workspaceRoot);
                result.push.apply(result, paths.map(function (p) { return pathToSuggestion(p, valueBeforeCursor, fullValue, range); }));
            }
        }
    };
}
exports.getPathCompletionParticipant = getPathCompletionParticipant;
function stripQuotes(fullValue) {
    if (strings_1.startsWith(fullValue, "'") || strings_1.startsWith(fullValue, "\"")) {
        return fullValue.slice(1, -1);
    }
    else {
        return fullValue;
    }
}
function shouldDoPathCompletion(tag, attr, value) {
    if (strings_1.startsWith(value, 'http') || strings_1.startsWith(value, 'https') || strings_1.startsWith(value, '//')) {
        return false;
    }
    if (PATH_TAG_AND_ATTR[tag]) {
        if (typeof PATH_TAG_AND_ATTR[tag] === 'string') {
            return PATH_TAG_AND_ATTR[tag] === attr;
        }
        else {
            return arrays_1.contains(PATH_TAG_AND_ATTR[tag], attr);
        }
    }
    return false;
}
/**
 * Get a list of path suggestions. Folder suggestions are suffixed with a slash.
 */
function providePaths(valueBeforeCursor, activeDocFsPath, root) {
    if (strings_1.startsWith(valueBeforeCursor, '/') && !root) {
        return [];
    }
    var lastIndexOfSlash = valueBeforeCursor.lastIndexOf('/');
    var valueBeforeLastSlash = valueBeforeCursor.slice(0, lastIndexOfSlash + 1);
    var parentDir = strings_1.startsWith(valueBeforeCursor, '/')
        ? path.resolve(root, '.' + valueBeforeLastSlash)
        : path.resolve(activeDocFsPath, '..', valueBeforeLastSlash);
    try {
        return fs.readdirSync(parentDir).map(function (f) {
            return isDir(path.resolve(parentDir, f))
                ? f + '/'
                : f;
        });
    }
    catch (e) {
        return [];
    }
}
function isDir(p) {
    try {
        return fs.statSync(p).isDirectory();
    }
    catch (e) {
        return false;
    }
}
function pathToSuggestion(p, valueBeforeCursor, fullValue, range) {
    var isDir = p[p.length - 1] === '/';
    var replaceRange;
    var lastIndexOfSlash = valueBeforeCursor.lastIndexOf('/');
    if (lastIndexOfSlash === -1) {
        replaceRange = shiftRange(range, 1, -1);
    }
    else {
        // For cases where cursor is in the middle of attribute value, like <script src="./s|rc/test.js">
        // Find the last slash before cursor, and calculate the start of replace range from there
        var valueAfterLastSlash = fullValue.slice(lastIndexOfSlash + 1);
        var startPos = shiftPosition(range.end, -1 - valueAfterLastSlash.length);
        // If whitespace exists, replace until it
        var whiteSpaceIndex = valueAfterLastSlash.indexOf(' ');
        var endPos = void 0;
        if (whiteSpaceIndex !== -1) {
            endPos = shiftPosition(startPos, whiteSpaceIndex);
        }
        else {
            endPos = shiftPosition(range.end, -1);
        }
        replaceRange = vscode_languageserver_types_1.Range.create(startPos, endPos);
    }
    if (isDir) {
        return {
            label: p,
            kind: vscode_languageserver_types_1.CompletionItemKind.Folder,
            textEdit: vscode_languageserver_types_1.TextEdit.replace(replaceRange, p),
            command: {
                title: 'Suggest',
                command: 'editor.action.triggerSuggest'
            }
        };
    }
    else {
        return {
            label: p,
            kind: vscode_languageserver_types_1.CompletionItemKind.File,
            textEdit: vscode_languageserver_types_1.TextEdit.replace(replaceRange, p)
        };
    }
}
function resolveWorkspaceRoot(activeDoc, workspaceFolders) {
    for (var i = 0; i < workspaceFolders.length; i++) {
        if (strings_1.startsWith(activeDoc.uri, workspaceFolders[i].uri)) {
            return path.resolve(vscode_uri_1.default.parse(workspaceFolders[i].uri).fsPath);
        }
    }
}
function shiftPosition(pos, offset) {
    return vscode_languageserver_types_1.Position.create(pos.line, pos.character + offset);
}
function shiftRange(range, startOffset, endOffset) {
    var start = shiftPosition(range.start, startOffset);
    var end = shiftPosition(range.end, endOffset);
    return vscode_languageserver_types_1.Range.create(start, end);
}
// Selected from https://stackoverflow.com/a/2725168/1780148
var PATH_TAG_AND_ATTR = {
    // HTML 4
    a: 'href',
    body: 'background',
    del: 'cite',
    form: 'action',
    frame: ['src', 'longdesc'],
    img: ['src', 'longdesc'],
    ins: 'cite',
    link: 'href',
    object: 'data',
    q: 'cite',
    script: 'src',
    // HTML 5
    audio: 'src',
    button: 'formaction',
    command: 'icon',
    embed: 'src',
    html: 'manifest',
    input: 'formaction',
    source: 'src',
    track: 'src',
    video: ['src', 'poster']
};
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\html-language-features\server\out/modes\pathCompletion.js.map

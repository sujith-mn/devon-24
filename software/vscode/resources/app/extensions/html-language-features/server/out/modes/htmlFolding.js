/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_1 = require("vscode-languageserver");
function getFoldingRanges(languageModes, document, maxRanges, cancellationToken) {
    var htmlMode = languageModes.getMode('html');
    var range = vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(0, 0), vscode_languageserver_1.Position.create(document.lineCount, 0));
    var ranges = [];
    if (htmlMode && htmlMode.getFoldingRanges) {
        ranges.push.apply(ranges, htmlMode.getFoldingRanges(document, range));
    }
    var modeRanges = languageModes.getModesInRange(document, range);
    for (var _i = 0, modeRanges_1 = modeRanges; _i < modeRanges_1.length; _i++) {
        var modeRange = modeRanges_1[_i];
        var mode = modeRange.mode;
        if (mode && mode !== htmlMode && mode.getFoldingRanges && !modeRange.attributeValue) {
            ranges.push.apply(ranges, mode.getFoldingRanges(document, modeRange));
        }
    }
    if (maxRanges && ranges.length > maxRanges) {
        ranges = limitRanges(ranges, maxRanges);
    }
    return ranges;
}
exports.getFoldingRanges = getFoldingRanges;
function limitRanges(ranges, maxRanges) {
    ranges = ranges.sort(function (r1, r2) {
        var diff = r1.startLine - r2.startLine;
        if (diff === 0) {
            diff = r1.endLine - r2.endLine;
        }
        return diff;
    });
    // compute each range's nesting level in 'nestingLevels'.
    // count the number of ranges for each level in 'nestingLevelCounts'
    var top = void 0;
    var previous = [];
    var nestingLevels = [];
    var nestingLevelCounts = [];
    var setNestingLevel = function (index, level) {
        nestingLevels[index] = level;
        if (level < 30) {
            nestingLevelCounts[level] = (nestingLevelCounts[level] || 0) + 1;
        }
    };
    // compute nesting levels and sanitize
    for (var i = 0; i < ranges.length; i++) {
        var entry = ranges[i];
        if (!top) {
            top = entry;
            setNestingLevel(i, 0);
        }
        else {
            if (entry.startLine > top.startLine) {
                if (entry.endLine <= top.endLine) {
                    previous.push(top);
                    top = entry;
                    setNestingLevel(i, previous.length);
                }
                else if (entry.startLine > top.endLine) {
                    do {
                        top = previous.pop();
                    } while (top && entry.startLine > top.endLine);
                    if (top) {
                        previous.push(top);
                    }
                    top = entry;
                    setNestingLevel(i, previous.length);
                }
            }
        }
    }
    var entries = 0;
    var maxLevel = 0;
    for (var i = 0; i < nestingLevelCounts.length; i++) {
        var n = nestingLevelCounts[i];
        if (n) {
            if (n + entries > maxRanges) {
                maxLevel = i;
                break;
            }
            entries += n;
        }
    }
    return ranges.filter(function (r, index) { return (typeof nestingLevels[index] === 'number') && nestingLevels[index] < maxLevel; });
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/extensions\html-language-features\server\out/modes\htmlFolding.js.map

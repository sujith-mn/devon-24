/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";!function(){try{const n=function(){const o=window.location.search.substring(1).split("&");for(var n=0;n<o.length;n++){var c=o[n].split("=");if("config"===c[0]&&c[1])return JSON.parse(decodeURIComponent(c[1]))}return{}}(),c=window.document,e=n.baseTheme||"vs";c.body.className="monaco-shell "+e;var o=n.backgroundColor;o||(o="hc-black"===e?"#000000":"vs"===e?"#FFFFFF":"#1E1E1E");const r="hc-black"===e?"#FFFFFF":"vs"===e?"#6C6C6C":"#CCCCCC",s=c.createElement("style");s.innerHTML=".monaco-shell { background-color:"+o+"; color:"+r+"; }",c.head.appendChild(s)}catch(o){console.error(o)}}();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/d0182c3417d225529c6d5ad24b7572815d0de9ac/core/vs\workbench\electron-browser\bootstrap\preload.js.map

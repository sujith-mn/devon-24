webpackJsonp([267],{2124:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),i=(n.n(r),n(6)),o=(n.n(i),n(2354)),l=n(2355),a=n(699),s=n(387),p=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),c=function(e){function t(t){var r=e.call(this,t)||this;return r.handleCompare=function(e){var t=n.i(s.b)(r.props.profile.name,r.props.profile.language,r.props.organization,e);r.context.router.push(t)},r.state={loading:!1},r}return p(t,e),t.prototype.componentDidMount=function(){this.mounted=!0,this.loadResults()},t.prototype.componentDidUpdate=function(e){e.profile===this.props.profile&&e.location===this.props.location||this.loadResults()},t.prototype.componentWillUnmount=function(){this.mounted=!1},t.prototype.loadResults=function(){var e=this,t=this.props.location.query.withKey;if(!t)return void this.setState({left:void 0,loading:!1});this.setState({loading:!0}),n.i(a.d)(this.props.profile.key,t).then(function(t){e.mounted&&e.setState({left:t.left,right:t.right,inLeft:t.inLeft,inRight:t.inRight,modified:t.modified,loading:!1})})},t.prototype.render=function(){var e=this.props,t=e.profile,n=e.profiles,i=e.location,a=i.query.withKey,s=this.state,p=s.left,c=s.right,u=s.inLeft,h=s.inRight,f=s.modified;return r.createElement("div",{className:"boxed-group boxed-group-inner js-profile-comparison"},r.createElement("header",null,r.createElement(o.a,{withKey:a,profile:t,profiles:n,onCompare:this.handleCompare}),this.state.loading&&r.createElement("i",{className:"spinner spacer-left"})),null!=p&&null!=u&&null!=c&&null!=h&&null!=f&&r.createElement("div",{className:"spacer-top"},r.createElement(l.a,{left:p,right:c,inLeft:u,inRight:h,modified:f,organization:this.props.organization})))},t.contextTypes={router:i.object},t}(r.PureComponent);t.default=c},2353:function(e,t,n){"use strict";function r(){return i.createElement("div",{className:"big-spacer-top"},n.i(o.translate)("quality_profile.empty_comparison"))}t.a=r;var i=n(0),o=(n.n(i),n(2))},2354:function(e,t,n){"use strict";var r=n(0),i=(n.n(r),n(61)),o=(n.n(i),n(2)),l=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return l(t,e),t.prototype.handleChange=function(e){this.props.onCompare(e.value)},t.prototype.render=function(){var e=this.props,t=e.profile,l=e.profiles,a=e.withKey,s=l.filter(function(e){return e.language===t.language&&e!==t}).map(function(e){return{value:e.key,label:e.name}});return r.createElement("div",{className:"display-inline-block"},r.createElement("label",{className:"spacer-right"},n.i(o.translate)("quality_profiles.compare_with")),r.createElement(i,{value:a,options:s,placeholder:n.i(o.translate)("select_verb"),clearable:!1,className:"input-large",onChange:this.handleChange.bind(this)}))},t}(r.PureComponent);t.a=a},2355:function(e,t,n){"use strict";var r=n(0),i=(n.n(r),n(9)),o=n(2353),l=n(270),a=n(2),s=n(34),p=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),c=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return p(t,e),t.prototype.renderRule=function(e,t){return r.createElement("div",null,r.createElement(l.a,{severity:t})," ",r.createElement(i.Link,{to:n.i(s.d)({rule_key:e.key},this.props.organization)},e.name))},t.prototype.renderParameters=function(e){return e?r.createElement("ul",null,Object.keys(e).map(function(t){return r.createElement("li",{key:t,className:"spacer-top"},r.createElement("code",null,t,": ",e[t]))})):null},t.prototype.renderLeft=function(){var e=this;return 0===this.props.inLeft.length?null:[r.createElement("tr",{key:"left-header"},r.createElement("td",null,r.createElement("h6",null,n.i(a.translateWithParameters)("quality_profiles.x_rules_only_in",this.props.inLeft.length)," ",this.props.left.name)),r.createElement("td",null," "))].concat(this.props.inLeft.map(function(t){return r.createElement("tr",{key:"left-"+t.key,className:"js-comparison-in-left"},r.createElement("td",null,e.renderRule(t,t.severity)),r.createElement("td",null," "))}))},t.prototype.renderRight=function(){var e=this;return 0===this.props.inRight.length?null:[r.createElement("tr",{key:"right-header"},r.createElement("td",null," "),r.createElement("td",null,r.createElement("h6",null,n.i(a.translateWithParameters)("quality_profiles.x_rules_only_in",this.props.inRight.length)," ",this.props.right.name)))].concat(this.props.inRight.map(function(t){return r.createElement("tr",{key:"right-"+t.key,className:"js-comparison-in-right"},r.createElement("td",null," "),r.createElement("td",null,e.renderRule(t,t.severity)))}))},t.prototype.renderModified=function(){var e=this;return 0===this.props.modified.length?null:[r.createElement("tr",{key:"modified-header"},r.createElement("td",{colSpan:2,className:"text-center"},r.createElement("h6",null,n.i(a.translateWithParameters)("quality_profiles.x_rules_have_different_configuration",this.props.modified.length)))),r.createElement("tr",{key:"modified-second-header"},r.createElement("td",null,r.createElement("h6",null,this.props.left.name)),r.createElement("td",null,r.createElement("h6",null,this.props.right.name)))].concat(this.props.modified.map(function(t){return r.createElement("tr",{key:"modified-"+t.key,className:"js-comparison-modified"},r.createElement("td",null,e.renderRule(t,t.left.severity),e.renderParameters(t.left.params)),r.createElement("td",null,e.renderRule(t,t.right.severity),e.renderParameters(t.right.params)))}))},t.prototype.render=function(){return this.props.inLeft.length||this.props.inRight.length||this.props.modified.length?r.createElement("table",{className:"data zebra quality-profile-comparison-table"},r.createElement("tbody",null,this.renderLeft(),this.renderRight(),this.renderModified())):r.createElement(o.a,null)},t}(r.PureComponent);t.a=c}});
//# sourceMappingURL=267.3892e1f4.chunk.js.map
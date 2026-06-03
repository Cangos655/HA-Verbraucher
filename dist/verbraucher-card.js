/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=globalThis,z=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),Z=new WeakMap;let J=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(z&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Z.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Z.set(e,t))}return t}toString(){return this.cssText}};const ut=s=>new J(typeof s=="string"?s:s+"",void 0,j),K=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,r,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new J(e,s,j)},ft=(s,t)=>{if(z)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),r=U.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},G=z?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return ut(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gt,defineProperty:$t,getOwnPropertyDescriptor:_t,getOwnPropertyNames:mt,getOwnPropertySymbols:vt,getPrototypeOf:yt}=Object,H=globalThis,Q=H.trustedTypes,bt=Q?Q.emptyScript:"",At=H.reactiveElementPolyfillSupport,w=(s,t)=>s,R={toAttribute(s,t){switch(t){case Boolean:s=s?bt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},L=(s,t)=>!gt(s,t),X={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:L};Symbol.metadata??=Symbol("metadata"),H.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=X){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&$t(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:n}=_t(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const h=r?.call(this);n?.call(this,o),this.requestUpdate(t,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??X}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const t=yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,i=[...mt(e),...vt(e)];for(const r of i)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)e.unshift(G(r))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ft(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const n=(i.converter?.toAttribute!==void 0?i.converter:R).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=i.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:R;this._$Em=r;const h=o.fromAttribute(e,n.type);this[r]=h??this._$Ej?.get(r)??h,this._$Em=null}}requestUpdate(t,e,i,r=!1,n){if(t!==void 0){const o=this.constructor;if(r===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??L)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,n]of i){const{wrapped:o}=n,h=this[r];o!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,n,h)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[w("elementProperties")]=new Map,v[w("finalized")]=new Map,At?.({ReactiveElement:v}),(H.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const V=globalThis,Y=s=>s,M=V.trustedTypes,tt=M?M.createPolicy("lit-html",{createHTML:s=>s}):void 0,et="$lit$",g=`lit$${Math.random().toFixed(9).slice(2)}$`,it="?"+g,wt=`<${it}>`,$=document,x=()=>$.createComment(""),E=s=>s===null||typeof s!="object"&&typeof s!="function",I=Array.isArray,xt=s=>I(s)||typeof s?.[Symbol.iterator]=="function",W=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,st=/-->/g,rt=/>/g,_=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nt=/'/g,ot=/"/g,at=/^(?:script|style|textarea|title)$/i,Et=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),N=Et(1),y=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),ht=new WeakMap,m=$.createTreeWalker($,129);function ct(s,t){if(!I(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return tt!==void 0?tt.createHTML(t):t}const St=(s,t)=>{const e=s.length-1,i=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=S;for(let h=0;h<e;h++){const a=s[h];let d,p,c=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===S?p[1]==="!--"?o=st:p[1]!==void 0?o=rt:p[2]!==void 0?(at.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=_):p[3]!==void 0&&(o=_):o===_?p[0]===">"?(o=r??S,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?_:p[3]==='"'?ot:nt):o===ot||o===nt?o=_:o===st||o===rt?o=S:(o=_,r=void 0);const f=o===_&&s[h+1].startsWith("/>")?" ":"";n+=o===S?a+wt:c>=0?(i.push(d),a.slice(0,c)+et+a.slice(c)+g+f):a+g+(c===-2?h:f)}return[ct(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class P{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let n=0,o=0;const h=t.length-1,a=this.parts,[d,p]=St(t,e);if(this.el=P.createElement(d,i),m.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=m.nextNode())!==null&&a.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(const c of r.getAttributeNames())if(c.endsWith(et)){const u=p[o++],f=r.getAttribute(c).split(g),O=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:O[2],strings:f,ctor:O[1]==="."?Pt:O[1]==="?"?kt:O[1]==="@"?Ot:T}),r.removeAttribute(c)}else c.startsWith(g)&&(a.push({type:6,index:n}),r.removeAttribute(c));if(at.test(r.tagName)){const c=r.textContent.split(g),u=c.length-1;if(u>0){r.textContent=M?M.emptyScript:"";for(let f=0;f<u;f++)r.append(c[f],x()),m.nextNode(),a.push({type:2,index:++n});r.append(c[u],x())}}}else if(r.nodeType===8)if(r.data===it)a.push({type:2,index:n});else{let c=-1;for(;(c=r.data.indexOf(g,c+1))!==-1;)a.push({type:7,index:n}),c+=g.length-1}n++}}static createElement(t,e){const i=$.createElement("template");return i.innerHTML=t,i}}function b(s,t,e=s,i){if(t===y)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl;const n=E(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=b(s,r._$AS(s,t.values),r,i)),t}class Ct{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??$).importNode(e,!0);m.currentNode=r;let n=m.nextNode(),o=0,h=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new k(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ut(n,this,t)),this._$AV.push(d),a=i[++h]}o!==a?.index&&(n=m.nextNode(),o++)}return m.currentNode=$,r}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=b(this,t,e),E(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==y&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T($.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(ct(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const n=new Ct(r,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=ht.get(t.strings);return e===void 0&&ht.set(t.strings,e=new P(t)),e}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const n of t)r===e.length?e.push(i=new k(this.O(x()),this.O(x()),this,this.options)):i=e[r],i._$AI(n),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=Y(t).nextSibling;Y(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class T{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(t,e=this,i,r){const n=this.strings;let o=!1;if(n===void 0)t=b(this,t,e,0),o=!E(t)||t!==this._$AH&&t!==y,o&&(this._$AH=t);else{const h=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=b(this,h[i+a],e,a),d===y&&(d=this._$AH[a]),o||=!E(d)||d!==this._$AH[a],d===l?t=l:t!==l&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pt extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}}class kt extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}}class Ot extends T{constructor(t,e,i,r,n){super(t,e,i,r,n),this.type=5}_$AI(t,e=this){if((t=b(this,t,e,0)??l)===y)return;const i=this._$AH,r=t===l&&i!==l||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==l&&(i===l||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Ut{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){b(this,t)}}const Ht=V.litHtmlPolyfillSupport;Ht?.(P,k),(V.litHtmlVersions??=[]).push("3.3.3");const Rt=(s,t,e)=>{const i=e?.renderBefore??t;let r=i._$litPart$;if(r===void 0){const n=e?.renderBefore??null;i._$litPart$=r=new k(t.insertBefore(x(),n),n,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=globalThis;class A extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return y}}A._$litElement$=!0,A.finalized=!0,B.litElementHydrateSupport?.({LitElement:A});const Mt=B.litElementPolyfillSupport;Mt?.({LitElement:A}),(B.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:L},Tt=(s=Nt,t,e)=>{const{kind:i,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(e.name,s),i==="accessor"){const{name:o}=e;return{set(h){const a=t.get.call(this);t.set.call(this,h),this.requestUpdate(o,a,s,!0,h)},init(h){return h!==void 0&&this.C(o,void 0,s,h),h}}}if(i==="setter"){const{name:o}=e;return function(h){const a=this[o];t.call(this,h),this.requestUpdate(o,a,s,!0,h)}}throw Error("Unsupported decorator location: "+i)};function q(s){return(t,e)=>typeof e=="object"?Tt(s,t,e):((i,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(r,n):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Dt(s){return q({...s,state:!0,attribute:!1})}var zt=Object.defineProperty,jt=Object.getOwnPropertyDescriptor,dt=(s,t,e,i)=>{for(var r=i>1?void 0:i?jt(t,e):t,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(t,e,r):o(r))||r);return i&&r&&zt(t,e,r),r};const pt="0.1.0";let D=class extends A{static getConfigElement(){return document.createElement("verbraucher-card-editor")}static getStubConfig(){return{type:"custom:verbraucher-card",title:"Verbraucher",entities:[]}}setConfig(s){if(!s.entities||!Array.isArray(s.entities))throw new Error('verbraucher-card: "entities" muss eine Liste sein');this._config=s}_power(s){const t=this.hass?.states[s.entity],e=parseFloat(t?.state??"");return isNaN(e)?0:e}_energy(s){const t=this.hass?.states[s.energy_entity],e=parseFloat(t?.state??"");return isNaN(e)?0:e}get _totalEnergy(){return this._config?this._config.entities.reduce((s,t)=>s+this._energy(t),0):0}get _maxPower(){return this._config?Math.max(...this._config.entities.map(s=>this._power(s)),1):0}_barClass(s){return s>50?"high":s>15?"mid":"low"}_renderRow(s){const t=this._power(s),e=this._energy(s),i=Math.round(t/this._maxPower*100),r=t>0,n=s.icon??this.hass?.states[s.entity]?.attributes?.icon??"mdi:lightning-bolt",o=s.name??s.entity;return N`
      <div class="row ${r?"active":""}">
        <div class="row-top">
          <div class="row-left">
            <ha-icon class="icon" .icon=${n}></ha-icon>
            <span class="name">${o}</span>
          </div>
          <div class="row-right">
            <div class="val-block">
              <span class="val ${r?"active":""}">${t.toLocaleString("de-DE",{maximumFractionDigits:0})}</span>
              <span class="unit">W</span>
            </div>
            <div class="val-block">
              <span class="val">${e.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:2})}</span>
              <span class="unit">kWh</span>
            </div>
          </div>
        </div>
        <div class="bar-track">
          <div class="bar-fill ${this._barClass(i)}" style="width:${i}%"></div>
        </div>
      </div>
    `}render(){if(!this._config||!this.hass)return l;const s=this._config.title??"Verbraucher",t=this._totalEnergy;return N`
      <ha-card>
        <div class="header">
          <div class="header-top">
            <span class="title">${s}</span>
            <span class="version">v${pt}</span>
          </div>
          <div class="total-row">
            <span class="total-num">${t.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:2})}</span>
            <span class="total-unit">kWh heute</span>
          </div>
        </div>
        <div class="body">
          ${this._config.entities.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}};D.styles=K`
    :host {
      display: block;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color));
    }
    .header {
      padding: 16px 20px 14px;
      background: linear-gradient(135deg, #1e88e5, #1565c0);
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .title {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,.65);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .version {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,.45);
      background: rgba(255,255,255,.12);
      border-radius: 10px;
      padding: 2px 8px;
      letter-spacing: .3px;
    }
    .total-row {
      display: flex;
      align-items: flex-end;
      gap: 6px;
    }
    .total-num {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }
    .total-unit {
      font-size: 14px;
      color: rgba(255,255,255,.6);
      margin-bottom: 3px;
    }
    .body {
      padding: 4px 0;
    }
    .row {
      padding: 10px 20px;
      border-bottom: 1px solid rgba(30,136,229,.1);
      transition: background .15s;
    }
    .row:last-child {
      border-bottom: none;
    }
    .row.active {
      background: rgba(30,136,229,.08);
    }
    .row-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .row-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .icon {
      --mdc-icon-size: 18px;
      color: #90caf9;
      flex-shrink: 0;
    }
    .name {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,.85);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row-right {
      display: flex;
      gap: 14px;
      flex-shrink: 0;
    }
    .val-block {
      text-align: right;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,.6);
    }
    .val.active {
      color: #90caf9;
    }
    .unit {
      font-size: 10px;
      color: rgba(255,255,255,.35);
      margin-left: 2px;
    }
    .bar-track {
      height: 3px;
      background: rgba(255,255,255,.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 2px;
      transition: width .5s ease;
    }
    .bar-fill.high { background: linear-gradient(90deg, #1565c0, #03a9f4); }
    .bar-fill.mid  { background: linear-gradient(90deg, #1e88e5, #90caf9); }
    .bar-fill.low  { background: rgba(30,136,229,.3); }
  `,dt([q({attribute:!1})],D.prototype,"hass",2),D=dt([lt("verbraucher-card")],D);var Lt=Object.defineProperty,Vt=Object.getOwnPropertyDescriptor,F=(s,t,e,i)=>{for(var r=i>1?void 0:i?Vt(t,e):t,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(t,e,r):o(r))||r);return i&&r&&Lt(t,e,r),r};let C=class extends A{setConfig(s){this._config=s}_fire(s){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}_titleChanged(s){const t=s.target.value;this._fire({...this._config,title:t||void 0})}_entityChanged(s,t,e){const i=s.detail.value,r=[...this._config?.entities??[]];r[t]={...r[t],[e]:i},this._fire({...this._config,entities:r})}_nameChanged(s,t){const e=s.target.value,i=[...this._config?.entities??[]];i[t]={...i[t],name:e||void 0},this._fire({...this._config,entities:i})}_iconChanged(s,t){const e=s.detail.value,i=[...this._config?.entities??[]];i[t]={...i[t],icon:e||void 0},this._fire({...this._config,entities:i})}_addRow(){const s=[...this._config?.entities??[]];s.push({entity:"",energy_entity:""}),this._fire({...this._config,entities:s})}_removeRow(s){const t=[...this._config?.entities??[]];t.splice(s,1),this._fire({...this._config,entities:t})}render(){return this._config?N`
      <div class="editor">
        <ha-textfield
          label="Titel (optional)"
          .value=${this._config.title??""}
          @change=${this._titleChanged}
        ></ha-textfield>

        <div class="section-header">
          <span>Verbraucher</span>
          <mwc-button @click=${this._addRow}>+ Hinzufügen</mwc-button>
        </div>

        ${(this._config.entities??[]).map((s,t)=>N`
          <div class="entry">
            <div class="entry-header">
              <span class="entry-label">Eintrag ${t+1}</span>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                @click=${()=>this._removeRow(t)}
              ></ha-icon-button>
            </div>

            <ha-entity-picker
              label="Leistungs-Sensor (W) *"
              .hass=${this.hass}
              .value=${s.entity}
              .includeDomains=${["sensor"]}
              allow-custom-entity
              @value-changed=${e=>this._entityChanged(e,t,"entity")}
            ></ha-entity-picker>

            <ha-entity-picker
              label="Energie-Sensor (kWh) *"
              .hass=${this.hass}
              .value=${s.energy_entity}
              .includeDomains=${["sensor"]}
              allow-custom-entity
              @value-changed=${e=>this._entityChanged(e,t,"energy_entity")}
            ></ha-entity-picker>

            <ha-textfield
              label="Name (optional)"
              .value=${s.name??""}
              @change=${e=>this._nameChanged(e,t)}
            ></ha-textfield>

            <ha-icon-picker
              label="Icon (optional)"
              .value=${s.icon??""}
              @value-changed=${e=>this._iconChanged(e,t)}
            ></ha-icon-picker>
          </div>
        `)}
      </div>
    `:l}};C.styles=K`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 4px 0;
    }
    ha-textfield {
      display: block;
      width: 100%;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
      color: var(--primary-text-color);
      margin-top: 4px;
    }
    .entry {
      border: 1px solid var(--divider-color, rgba(0,0,0,.12));
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .entry-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    ha-entity-picker,
    ha-icon-picker {
      display: block;
      width: 100%;
    }
  `,F([q({attribute:!1})],C.prototype,"hass",2),F([Dt()],C.prototype,"_config",2),C=F([lt("verbraucher-card-editor")],C),window.customCards=window.customCards??[],window.customCards.push({type:"verbraucher-card",name:"Verbraucher Card",description:"Zeigt Stromverbraucher mit aktuellem Verbrauch (W) und Tagesenergie (kWh)",preview:!1,documentationURL:"https://github.com/Cangos655/HA-Verbraucher"}),console.info(`%c VERBRAUCHER-CARD %c v${pt} `,"background:#1e88e5;color:#fff;font-weight:700;padding:2px 4px;border-radius:3px 0 0 3px","background:#1565c0;color:#fff;font-weight:400;padding:2px 4px;border-radius:0 3px 3px 0");

(this["webpackJsonpdrinking-game"]=this["webpackJsonpdrinking-game"]||[]).push([[4],{253:function(e,t,a){"use strict";var n=a(4),r=a(1),o=a(0),i=(a(9),a(10)),c=a(245),s=a(241),d=a(20),l=a(21),u=a(17),v=a(216),p=a(242);function b(e){return Object(v.a)("MuiTypography",e)}Object(p.a)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);var m=a(3),j=["align","className","component","gutterBottom","noWrap","paragraph","variant","variantMapping"],h=Object(d.a)("span",{name:"MuiTypography",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,a.variant&&t[a.variant],"inherit"!==a.align&&t["align".concat(Object(u.a)(a.align))],a.noWrap&&t.noWrap,a.gutterBottom&&t.gutterBottom,a.paragraph&&t.paragraph]}})((function(e){var t=e.theme,a=e.ownerState;return Object(r.a)({margin:0},a.variant&&t.typography[a.variant],"inherit"!==a.align&&{textAlign:a.align},a.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},a.gutterBottom&&{marginBottom:"0.35em"},a.paragraph&&{marginBottom:16})})),g={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"},f={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},O=o.forwardRef((function(e,t){var a=Object(l.a)({props:e,name:"MuiTypography"}),o=function(e){return f[e]||e}(a.color),d=Object(c.a)(Object(r.a)({},a,{color:o})),v=d.align,p=void 0===v?"inherit":v,O=d.className,y=d.component,x=d.gutterBottom,w=void 0!==x&&x,M=d.noWrap,k=void 0!==M&&M,C=d.paragraph,S=void 0!==C&&C,R=d.variant,B=void 0===R?"body1":R,N=d.variantMapping,P=void 0===N?g:N,W=Object(n.a)(d,j),I=Object(r.a)({},d,{align:p,color:o,className:O,component:y,gutterBottom:w,noWrap:k,paragraph:S,variant:B,variantMapping:P}),q=y||(S?"p":P[B]||g[B])||"span",D=function(e){var t=e.align,a=e.gutterBottom,n=e.noWrap,r=e.paragraph,o=e.variant,i=e.classes,c={root:["root",o,"inherit"!==e.align&&"align".concat(Object(u.a)(t)),a&&"gutterBottom",n&&"noWrap",r&&"paragraph"]};return Object(s.a)(c,b,i)}(I);return Object(m.jsx)(h,Object(r.a)({as:q,ref:t,ownerState:I,className:Object(i.a)(D.root,O)},W))}));t.a=O},262:function(e,t,a){"use strict";a.r(t);var n=a(44),r=a(27),o=a(0),i=a(73),c=a(248);function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var d=a(4),l=a(1),u=(a(9),a(10)),v=a(241),p=a(21),b=a(20),m=a(216),j=a(242);function h(e){return Object(m.a)("MuiCardMedia",e)}Object(j.a)("MuiCardMedia",["root","media","img"]);var g=a(3),f=["children","className","component","image","src","style"],O=Object(b.a)("div",{name:"MuiCardMedia",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState,n=a.isMediaComponent,r=a.isImageComponent;return[t.root,n&&t.media,r&&t.img]}})((function(e){var t=e.ownerState;return Object(l.a)({display:"block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"},t.isMediaComponent&&{width:"100%"},t.isImageComponent&&{objectFit:"cover"})})),y=["video","audio","picture","iframe","img"],x=["picture","img"],w=o.forwardRef((function(e,t){var a=Object(p.a)({props:e,name:"MuiCardMedia"}),n=a.children,r=a.className,o=a.component,i=void 0===o?"div":o,c=a.image,s=a.src,b=a.style,m=Object(d.a)(a,f),j=-1!==y.indexOf(i),w=!j&&c?Object(l.a)({backgroundImage:'url("'.concat(c,'")')},b):b,M=Object(l.a)({},a,{component:i,isMediaComponent:j,isImageComponent:-1!==x.indexOf(i)}),k=function(e){var t=e.classes,a={root:["root",e.isMediaComponent&&"media",e.isImageComponent&&"img"]};return Object(v.a)(a,h,t)}(M);return Object(g.jsx)(O,Object(l.a)({className:Object(u.a)(k.root,r),as:i,role:!j&&c?"image":void 0,ref:t,style:w,ownerState:M,src:j?c||s:void 0},m,{children:n}))})),M=a(240);function k(e){return Object(m.a)("MuiPaper",e)}Object(j.a)("MuiPaper",["root","rounded","outlined","elevation","elevation0","elevation1","elevation2","elevation3","elevation4","elevation5","elevation6","elevation7","elevation8","elevation9","elevation10","elevation11","elevation12","elevation13","elevation14","elevation15","elevation16","elevation17","elevation18","elevation19","elevation20","elevation21","elevation22","elevation23","elevation24"]);var C=["className","component","elevation","square","variant"],S=function(e){return((e<1?5.11916*Math.pow(e,2):4.5*Math.log(e+1)+2)/100).toFixed(2)},R=Object(b.a)("div",{name:"MuiPaper",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,t[a.variant],!a.square&&t.rounded,"elevation"===a.variant&&t["elevation".concat(a.elevation)]]}})((function(e){var t=e.theme,a=e.ownerState;return Object(l.a)({backgroundColor:t.palette.background.paper,color:t.palette.text.primary,transition:t.transitions.create("box-shadow")},!a.square&&{borderRadius:t.shape.borderRadius},"outlined"===a.variant&&{border:"1px solid ".concat(t.palette.divider)},"elevation"===a.variant&&Object(l.a)({boxShadow:t.shadows[a.elevation]},"dark"===t.palette.mode&&{backgroundImage:"linear-gradient(".concat(Object(M.a)("#fff",S(a.elevation)),", ").concat(Object(M.a)("#fff",S(a.elevation)),")")}))})),B=o.forwardRef((function(e,t){var a=Object(p.a)({props:e,name:"MuiPaper"}),n=a.className,r=a.component,o=void 0===r?"div":r,i=a.elevation,c=void 0===i?1:i,s=a.square,b=void 0!==s&&s,m=a.variant,j=void 0===m?"elevation":m,h=Object(d.a)(a,C),f=Object(l.a)({},a,{component:o,elevation:c,square:b,variant:j}),O=function(e){var t=e.square,a=e.elevation,n=e.variant,r=e.classes,o={root:["root",n,!t&&"rounded","elevation"===n&&"elevation".concat(a)]};return Object(v.a)(o,k,r)}(f);return Object(g.jsx)(R,Object(l.a)({as:o,ownerState:f,className:Object(u.a)(O.root,n),ref:t},h))}));function N(e){return Object(m.a)("MuiCard",e)}Object(j.a)("MuiCard",["root"]);var P=["className","raised"],W=Object(b.a)(B,{name:"MuiCard",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(){return{overflow:"hidden"}})),I=o.forwardRef((function(e,t){var a=Object(p.a)({props:e,name:"MuiCard"}),n=a.className,r=a.raised,o=void 0!==r&&r,i=Object(d.a)(a,P),c=Object(l.a)({},a,{raised:o}),s=function(e){var t=e.classes;return Object(v.a)({root:["root"]},N,t)}(c);return Object(g.jsx)(W,Object(l.a)({className:Object(u.a)(s.root,n),elevation:o?8:void 0,ref:t,ownerState:c},i))})),q=function(e){var t=e.cardStyles,a=s(e,["cardStyles"]);return Object(g.jsx)(I,{sx:Object(n.a)(Object(n.a)({},t),{},{backgroundColor:"transparent"}),children:Object(g.jsx)(w,Object(n.a)(Object(n.a)({},a),{},{height:0}))})},D=a(253),T=a(43);t.default=function(e){var t="15px",a=Object(o.useState)({deck_id:"",remaining:52,shuffled:!1,success:!1,cards:[]}),s=Object(r.a)(a,2),d=s[0],l=s[1],u=Object(o.useState)(!1),v=Object(r.a)(u,2),p=v[0],b=v[1];Object(o.useEffect)((function(){fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then((function(e){return e.json()})).then((function(e){l(Object(n.a)(Object(n.a)({},e),{},{cards:[]}))}))}),[]);var m=function(){b(!0),fetch("https://deckofcardsapi.com/api/deck/".concat(d.deck_id,"/draw/?count=").concat(1)).then((function(e){return e.json()})).then((function(e){l(e),b(!1)}))};return Object(g.jsxs)(i.a,{sx:{},children:[void 0===d.cards[0]?Object(g.jsx)("div",{}):Object(g.jsx)(q,{cardStyles:{marginBottom:t},src:d.cards[0].image,alt:d.cards[0].value,component:"img",sx:{margin:"auto",height:"100%",width:"100%"}}),0===d.remaining&&void 0===d.cards[0]&&Object(g.jsx)("div",{children:"You have finished the pile !"}),Object(g.jsx)(c.a,{variant:"contained",color:"secondary",onClick:m,disabled:!d.success,sx:{marginBottom:t},children:52===d.remaining?"Begin Game":"Draw Card"}),Object(g.jsx)(c.a,{variant:"contained",color:"secondary",onClick:function(e){b(!0),fetch("https://deckofcardsapi.com/api/deck/".concat(d.deck_id,"/shuffle/")).then((function(e){return e.json()})).then((function(e){l(Object(n.a)(Object(n.a)({},e),{},{cards:[]})),m(),b(!1)}))},sx:{marginBottom:t},children:"Reshuffle Deck"}),Object(g.jsxs)(D.a,{variant:"subtitle1",children:["Cards remaining: ",d.remaining]}),p&&0!==d.remaining&&Object(g.jsx)(D.a,{variant:"subtitle1",children:Object(T.c)(["I be fetchinnn","Drawin a CARDD","Pls wait bruh"])})]})}}}]);
//# sourceMappingURL=4.03ed4683.chunk.js.map
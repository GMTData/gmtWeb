(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{"/A57":function(m,E,a){m.exports={simple:"simple___bZH2w",main:"main___3jXlk",icon:"icon___mDdB2",other:"other___2p6gu",register:"register___2E0Kt",prefixIcon:"prefixIcon___3ooTK",contentTitle:"contentTitle___2matv",widthContent:"widthContent___HWFAK",textYellow:"textYellow___2b36r",textWhite:"textWhite___2Ioz-",spanPointer:"spanPointer___-EjKx",tabLine:"tabLine___1wqmC",buttonUser:"buttonUser___2oc6b"}},"7lHW":function(m,E,a){m.exports=a.p+"static/image_mockup@2x.2a31d52b.png"},YMVA:function(m,E,a){"use strict";a.r(E);var ne=a("+L6B"),x=a("2/Rp"),le=a("Znn+"),B=a("ZTPi"),ie=a("miYZ"),u=a("tsqr"),D=a("tJVT"),ue=a("fOrg"),N=a("+KLJ"),p=a("cDcd"),e=a.n(p),F=a("VMEa"),f=a("Qurx"),A=a("/aGu"),j=a("tneF"),t=a("9kvl"),z=a("55Ip"),T=a("3YIu"),V=a("/A57"),n=a.n(V),S=a("z0pW"),w=a.n(S),Y=a("RuRJ"),oe=a.n(Y),G=a("+oO8"),ge=a.t("+oO8",1),c=a("+n12"),J=a("7lHW"),H=a.n(J),M="",Z=function(d){var _=d.content;return e.a.createElement(N.a,{style:{marginBottom:24},message:_,type:"error",showIcon:!0})},$=function(d){var _=d.userRegister,R=_===void 0?{}:_,O=d.submitting,L=R.status,W=R.type,Q=Object(p.useState)("mobile"),I=Object(D.a)(Q,2),P=I[0],X=I[1],s=Object(t.f)(),q=F.a.useForm(),k=Object(D.a)(q,1),C=k[0],K=function(){var r=[];P==="mail"?r=["mail","captcha","password","passwordAgain"]:r=["mobile","captcha","password","passwordAgain"],C.validateFields(r,function(y,v){});var o=d.dispatch,g=C.getFieldsValue(),i={emailAdress:g.mail,iphoneNumber:M,password:g.password,verificationCode:g.captcha,superiorRecommendationCode:g.recommendationCode,identity:"personal"};o({type:"register/register",payload:i,callback:function(v){v&&(v.state?s.locale==="zh-CN"?(u.default.success("\u6CE8\u518C\u6210\u529F\uFF01"),t.d.push("/user/login")):u.default.success("Registration successful!"):u.default.error(v.message))}})},ee=Object(p.useState)(),b=Object(D.a)(ee,2),ae=b[0],te=b[1],se=function(){s.locale==="zh-CN"&&te(G)};Object(p.useEffect)(function(){se()},[]);var re=function(r){M=r},U=function(r){var o={};if(r==="mail"){var g=C.getFieldValue("mail");g&&(o=Object(T.b)(g).then(function(i){i.state?s.locale==="zh-CN"?u.default.success(c.c):u.default.success(c.d):u.default.error(i.message)}))}else M&&(o=Object(T.c)(M).then(function(i){i.state?s.locale==="zh-CN"?u.default.success(c.c):u.default.success(c.d):u.default.error(i.message)}))};return e.a.createElement("div",null,e.a.createElement("div",{className:n.a.simple},e.a.createElement("img",{src:H.a,style:{width:"100%"}})),e.a.createElement("div",{className:n.a.main},e.a.createElement(F.a,{autoComplete:"off",initialValues:{autoLogin:!0},form:C,submitter:!1,onFinish:function(r){return K(r),Promise.resolve()}},e.a.createElement("div",{className:n.a.contentTitle},e.a.createElement("span",null,s.formatMessage({id:"pages.layouts.register.title",defaultMessage:"\u6B22\u8FCE\u6CE8\u518CGMT"}))),e.a.createElement(B.a,{activeKey:P,onChange:X,className:n.a.widthContent},e.a.createElement(B.a.TabPane,{key:"mobile",tab:s.formatMessage({id:"pages.register.phoneRegister.tab",defaultMessage:"\u624B\u673A\u6CE8\u518C"})}),e.a.createElement(B.a.TabPane,{key:"mail",tab:s.formatMessage({id:"pages.register.mailRegister.tab",defaultMessage:"\u90AE\u7BB1\u6CE8\u518C"})})),e.a.createElement("div",{className:n.a.tabLine}),e.a.createElement("div",{className:n.a.widthContent},L==="error"&&W==="mail"&&!O&&e.a.createElement(LoginMessage,{content:s.formatMessage({id:"pages.register.accountLogin.errorMessage",defaultMessage:"\u8D26\u6237\u6216\u5BC6\u7801\u9519\u8BEF\uFF08admin/ant.design)"})}),P==="mail"&&e.a.createElement(e.a.Fragment,null,e.a.createElement(f.a,{name:"mail",fieldProps:{size:"large"},placeholder:s.formatMessage({id:"pages.register.mail.placeholder",defaultMessage:"\u8BF7\u8F93\u5165\u90AE\u7BB1"}),rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.register.mail.required",defaultMessage:"\u8BF7\u8F93\u5165\u90AE\u7BB1!"})},{pattern:c.e,message:e.a.createElement(t.a,{id:"pages.register.email.reg",defaultMessage:"\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E\uFF01"})}]}),e.a.createElement(A.a,{fieldProps:{size:"large"},captchaProps:{size:"large"},placeholder:s.formatMessage({id:"pages.login.captcha.placeholder",defaultMessage:"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"}),captchaTextRender:function(r,o){return r?"".concat(o," ").concat(s.formatMessage({id:"pages.getCaptchaSecondText",defaultMessage:"\u83B7\u53D6\u9A8C\u8BC1\u7801"})):s.formatMessage({id:"pages.login.phoneLogin.getVerificationCode",defaultMessage:"\u83B7\u53D6\u9A8C\u8BC1\u7801"})},name:"captcha",rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.login.captcha.required",defaultMessage:"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801\uFF01"})}],onGetCaptcha:function(){return U("mail")}})),L==="error"&&W==="mobile"&&!O&&e.a.createElement(Z,{content:"\u9A8C\u8BC1\u7801\u9519\u8BEF"}),P==="mobile"&&e.a.createElement(e.a.Fragment,null,e.a.createElement(w.a,{name:"mobile",country:"cn",autoFormat:!0,enableSearch:!0,onChange:function(r){return re(r)},localization:ae,placeholder:s.formatMessage({id:"pages.login.phoneNumber.placeholder",defaultMessage:"\u624B\u673A\u53F7"}),rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.login.phoneNumber.required",defaultMessage:"\u8BF7\u8F93\u5165\u624B\u673A\u53F7\uFF01"})}]}),e.a.createElement(A.a,{fieldProps:{size:"large"},captchaProps:{size:"large"},placeholder:s.formatMessage({id:"pages.login.captcha.placeholder",defaultMessage:"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801"}),captchaTextRender:function(r,o){return r?"".concat(o," ").concat(s.formatMessage({id:"pages.getCaptchaSecondText",defaultMessage:"\u83B7\u53D6\u9A8C\u8BC1\u7801"})):s.formatMessage({id:"pages.login.phoneLogin.getVerificationCode",defaultMessage:"\u83B7\u53D6\u9A8C\u8BC1\u7801"})},name:"captcha",rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.login.captcha.required",defaultMessage:"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801\uFF01"})}],onGetCaptcha:function(){return U("mobile")}})),e.a.createElement(f.a.Password,{name:"password",fieldProps:{size:"large"},placeholder:s.formatMessage({id:"pages.register.password.placeholder",defaultMessage:"\u8BF7\u8F93\u5165\u5BC6\u7801"}),rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.register.password.required",defaultMessage:"\u8BF7\u8F93\u5165\u5BC6\u7801\uFF01"})},{pattern:c.o,message:e.a.createElement(t.a,{id:"pages.register.password.reg",defaultMessage:"\u5BC6\u78018-20\u4F4D,\u6570\u5B57,\u5B57\u6BCD\u6216\u5B57\u7B26\u81F3\u5C11\u4E24\u79CD\uFF01"})}]}),e.a.createElement(f.a.Password,{name:"passwordAgain",fieldProps:{size:"large"},placeholder:s.formatMessage({id:"pages.register.password.again.placeholder",defaultMessage:"\u8BF7\u8F93\u5165\u5BC6\u7801"}),rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.register.password.again.required",defaultMessage:"\u8BF7\u8F93\u5165\u5BC6\u7801\uFF01"})},{pattern:c.o,message:e.a.createElement(t.a,{id:"pages.register.password.reg",defaultMessage:"\u5BC6\u78018-20\u4F4D,\u6570\u5B57,\u5B57\u6BCD\u6216\u5B57\u7B26\u81F3\u5C11\u4E24\u79CD\uFF01"})},function(l){var r=l.getFieldValue;return{validator:function(g,i){return!i||r("password")===i?Promise.resolve():Promise.reject(s.formatMessage({id:"pages.register.password.notSame",defaultMessage:"\u4E24\u6B21\u5BC6\u7801\u4E0D\u4E00\u81F4"}))}}}]}),e.a.createElement(f.a,{name:"recommendationCode",fieldProps:{size:"large"},placeholder:s.formatMessage({id:"pages.register.recommendationCode.placeholder",defaultMessage:"\u8BF7\u8F93\u63A8\u8350\u7801"}),rules:[{required:!0,message:e.a.createElement(t.a,{id:"pages.register.recommendationCode.required",defaultMessage:"\u8BF7\u8F93\u63A8\u8350\u7801\uFF01"})}]}),e.a.createElement("div",{style:{marginBottom:24}},e.a.createElement(j.a,{noStyle:!0,name:"autoLogin"},e.a.createElement("span",{className:n.a.textWhite},e.a.createElement(t.a,{id:"pages.register.readAndAgree",defaultMessage:"\u6211\u5DF2\u9605\u8BFB\u5E76\u540C\u610F"}))),e.a.createElement("span",{className:n.a.textYellow},e.a.createElement(t.a,{id:"pages.login.userTerms",defaultMessage:"\u7528\u6237\u6761\u6B3E\u548C\u6761\u4EF6"}),e.a.createElement("span",{style:{color:"white"}},e.a.createElement(t.a,{id:"pages.login.asWell",defaultMessage:"\u4EE5\u53CA"})),e.a.createElement(t.a,{id:"pages.login.privacyPolicy",defaultMessage:"\u9690\u79C1\u653F\u7B56"})))),e.a.createElement(x.a,{className:n.a.buttonUser,onClick:K,loading:O},e.a.createElement(t.a,{id:"pages.register.button",defaultMessage:"\u521B\u5EFA\u8D26\u6237"}))),e.a.createElement("div",null,e.a.createElement("div",{className:n.a.widthContent,style:{marginTop:32,marginBottom:40,textAlign:"center"}},e.a.createElement("span",{className:n.a.textWhite},e.a.createElement(t.a,{id:"pages.register.haveAccount",defaultMessage:"\u5DF2\u6709\u8D26\u53F7?"})),e.a.createElement(z.a,{to:{pathname:"/user/login"}},e.a.createElement("span",{className:["".concat(n.a.textYellow),"".concat(n.a.spanPointer)].join(" ")},e.a.createElement(t.a,{id:"pages.register.signInNow",defaultMessage:"\u7ACB\u5373\u767B\u5F55"})))))))};E.default=Object(t.c)(function(h){var d=h.register,_=h.loading;return{userRegister:d,submitting:_.effects["register/register"]}})($)}}]);

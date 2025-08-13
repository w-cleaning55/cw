(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2076],{88:(e,a,r)=>{"use strict";r.d(a,{d:()=>s});var t=r(5155),n=r(2115),o=r(4884),i=r(3999);let s=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.bL,{className:(0,i.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",r),...n,ref:a,children:(0,t.jsx)(o.zi,{className:(0,i.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})})});s.displayName=o.bL.displayName},515:(e,a,r)=>{"use strict";r.d(a,{H:()=>s,s:()=>d});var t=r(5155),n=r(2115);let o={duration:{fast:150,normal:300,slow:500,ultra:1e3},easing:{linear:"linear",easeIn:"cubic-bezier(0.4, 0, 1, 1)",easeOut:"cubic-bezier(0, 0, 0.2, 1)",easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",bounce:"cubic-bezier(0.68, -0.55, 0.265, 1.55)",elastic:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",back:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",smooth:"cubic-bezier(0.25, 0.46, 0.45, 0.94)"},delays:{none:0,short:100,medium:200,long:500},enabled:!0,reducedMotion:!1,globalSpeed:1},i=(0,n.createContext)(void 0);function s(e){let{children:a,initialSettings:r}=e,[s,d]=(0,n.useState)({...o,...r}),[l,c]=(0,n.useState)(!1);(0,n.useEffect)(()=>{c(!0)},[]),(0,n.useEffect)(()=>{if(!l)return;let e=window.matchMedia("(prefers-reduced-motion: reduce)"),a=()=>{d(a=>({...a,reducedMotion:e.matches,enabled:!e.matches&&a.enabled}))};return a(),e.addEventListener("change",a),()=>e.removeEventListener("change",a)},[l]),(0,n.useEffect)(()=>{if(!l)return;let e=document.documentElement;Object.entries(s.duration).forEach(a=>{let[r,t]=a,n=Math.round(t*s.globalSpeed);e.style.setProperty(`--duration-${r}`,`${n}ms`)}),Object.entries(s.easing).forEach(a=>{let[r,t]=a;e.style.setProperty(`--easing-${r}`,t)}),Object.entries(s.delays).forEach(a=>{let[r,t]=a,n=Math.round(t*s.globalSpeed);e.style.setProperty(`--delay-${r}`,`${n}ms`)}),e.style.setProperty("--animation-enabled",s.enabled&&!s.reducedMotion?"1":"0"),e.style.setProperty("--global-speed",s.globalSpeed.toString()),!s.enabled||s.reducedMotion?e.classList.add("animations-disabled"):e.classList.remove("animations-disabled")},[s,l]);let u=e=>!s.enabled||s.reducedMotion?0:Math.round(s.duration[e]*s.globalSpeed),f=e=>!s.enabled||s.reducedMotion?"linear":s.easing[e],m=e=>!s.enabled||s.reducedMotion?0:Math.round(s.delays[e]*s.globalSpeed);return(0,t.jsxs)(i.Provider,{value:{settings:s,updateSettings:e=>{d(a=>({...a,...e}))},setGlobalSpeed:e=>{d(a=>({...a,globalSpeed:Math.max(.1,Math.min(5,e))}))},enableAnimations:e=>{d(a=>({...a,enabled:e}))},getDuration:u,getEasing:f,getDelay:m,createTransition:function(e){let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"normal",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"easeInOut",t=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none";if(!s.enabled||s.reducedMotion)return"none";let n=u(a),o=f(r),i=m(t);return`${e} ${n}ms ${o} ${i}ms`},isAnimationEnabled:()=>s.enabled&&!s.reducedMotion},children:[a,l&&(0,t.jsx)("style",{suppressHydrationWarning:!0,children:`
            /* Animation CSS Variables */
            :root {
              /* Standard durations */
              --duration-fast: 150ms;
              --duration-normal: 300ms;
              --duration-slow: 500ms;
              --duration-ultra: 1000ms;
              
              /* Standard easings */
              --easing-linear: linear;
              --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
              --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
              --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
              --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
              --easing-elastic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
              --easing-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
              --easing-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
              
              /* Standard delays */
              --delay-none: 0ms;
              --delay-short: 100ms;
              --delay-medium: 200ms;
              --delay-long: 500ms;
            }

            /* Professional animation classes */
            .animate-fade-in {
              animation: fadeIn var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-up {
              animation: slideUp var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-down {
              animation: slideDown var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-left {
              animation: slideLeft var(--duration-normal) var(--easing-ease-out);
            }

            .animate-slide-right {
              animation: slideRight var(--duration-normal) var(--easing-ease-out);
            }

            .animate-scale-in {
              animation: scaleIn var(--duration-normal) var(--easing-bounce);
            }

            .animate-rotate-in {
              animation: rotateIn var(--duration-slow) var(--easing-elastic);
            }

            .animate-bounce {
              animation: bounce var(--duration-ultra) var(--easing-bounce) infinite;
            }

            .animate-pulse {
              animation: pulse var(--duration-slow) var(--easing-ease-in-out) infinite;
            }

            .animate-float {
              animation: float var(--duration-ultra) var(--easing-ease-in-out) infinite;
            }

            /* Stagger animations */
            .stagger-children > *:nth-child(1) { animation-delay: calc(var(--delay-short) * 0); }
            .stagger-children > *:nth-child(2) { animation-delay: calc(var(--delay-short) * 1); }
            .stagger-children > *:nth-child(3) { animation-delay: calc(var(--delay-short) * 2); }
            .stagger-children > *:nth-child(4) { animation-delay: calc(var(--delay-short) * 3); }
            .stagger-children > *:nth-child(5) { animation-delay: calc(var(--delay-short) * 4); }
            .stagger-children > *:nth-child(n+6) { animation-delay: calc(var(--delay-short) * 5); }

            /* Hover animations */
            .hover-lift {
              transition: transform var(--duration-fast) var(--easing-ease-out);
            }

            .hover-lift:hover {
              transform: translateY(-4px);
            }

            .hover-scale {
              transition: transform var(--duration-fast) var(--easing-ease-out);
            }

            .hover-scale:hover {
              transform: scale(1.05);
            }

            .hover-glow {
              transition: box-shadow var(--duration-normal) var(--easing-ease-out);
            }

            .hover-glow:hover {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
            }

            /* Keyframe definitions */
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes slideUp {
              from { 
                opacity: 0; 
                transform: translateY(20px); 
              }
              to { 
                opacity: 1; 
                transform: translateY(0); 
              }
            }

            @keyframes slideDown {
              from { 
                opacity: 0; 
                transform: translateY(-20px); 
              }
              to { 
                opacity: 1; 
                transform: translateY(0); 
              }
            }

            @keyframes slideLeft {
              from { 
                opacity: 0; 
                transform: translateX(20px); 
              }
              to { 
                opacity: 1; 
                transform: translateX(0); 
              }
            }

            @keyframes slideRight {
              from { 
                opacity: 0; 
                transform: translateX(-20px); 
              }
              to { 
                opacity: 1; 
                transform: translateX(0); 
              }
            }

            @keyframes scaleIn {
              from { 
                opacity: 0; 
                transform: scale(0.8); 
              }
              to { 
                opacity: 1; 
                transform: scale(1); 
              }
            }

            @keyframes rotateIn {
              from { 
                opacity: 0; 
                transform: rotate(-180deg) scale(0.5); 
              }
              to { 
                opacity: 1; 
                transform: rotate(0deg) scale(1); 
              }
            }

            @keyframes bounce {
              0%, 20%, 53%, 80%, 100% {
                transform: translateY(0);
              }
              40%, 43% {
                transform: translateY(-10px);
              }
              70% {
                transform: translateY(-5px);
              }
              90% {
                transform: translateY(-2px);
              }
            }

            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.6;
              }
            }

            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-6px);
              }
            }

            /* Disable animations when needed */
            .animations-disabled,
            .animations-disabled *,
            .animations-disabled *:before,
            .animations-disabled *:after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              transition-delay: 0.01ms !important;
            }

            /* Accessibility: Respect user preferences */
            @media (prefers-reduced-motion: reduce) {
              *,
              *:before,
              *:after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                transition-delay: 0.01ms !important;
                scroll-behavior: auto !important;
              }
            }

            /* Performance optimizations */
            .animate-fade-in,
            .animate-slide-up,
            .animate-slide-down,
            .animate-slide-left,
            .animate-slide-right,
            .animate-scale-in,
            .animate-rotate-in {
              will-change: transform, opacity;
            }

            .hover-lift,
            .hover-scale {
              will-change: transform;
            }

            .hover-glow {
              will-change: box-shadow;
            }

            /* Print styles - disable animations */
            @media print {
              *,
              *:before,
              *:after {
                animation: none !important;
                transition: none !important;
              }
            }
          `})]})}let d=()=>{let e=(0,n.useContext)(i);if(void 0===e)throw Error("useAnimation must be used within an AnimationController");return e}},2555:(e,a,r)=>{"use strict";r.d(a,{cy:()=>i,As:()=>s,hD:()=>d});var t=r(2115);class n{constructor(){this.tokenKey="auth_token",this.baseUrl="/api"}async login(e){try{let a=await fetch(`${this.baseUrl}/auth/login?debug=1`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!a.ok){let e="بيانات تسجيل الدخول غير صحيحة";try{let r=await a.json();if(r?.error&&(e=r.error),r?.debug){let a=Error(e);throw a.debug=r.debug,a}}catch(e){}throw Error(e)}let r=await a.json();return this.setToken(r.token),r}catch(e){throw console.error("Login error:",e),e}}async logout(){try{await fetch(`${this.baseUrl}/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${this.getToken()}`}})}catch(e){console.error("Logout error:",e)}finally{this.removeToken()}}async verifyToken(){let e=this.getToken();if(!e)return null;try{let a=await fetch(`${this.baseUrl}/auth/verify`,{headers:{Authorization:`Bearer ${e}`}});if(!a.ok)return this.removeToken(),null;return await a.json()}catch(e){return console.error("Token verification error:",e),this.removeToken(),null}}getToken(){return localStorage.getItem(this.tokenKey)}setToken(e){localStorage.setItem(this.tokenKey,e)}removeToken(){localStorage.removeItem(this.tokenKey)}isAuthenticated(){return!!this.getToken()}}let o=new n,i=(0,t.createContext)(null);function s(){let e=(0,t.useContext)(i);if(!e)throw Error("useAuth must be used within an AuthProvider");return e}function d(){let[e,a]=(0,t.useState)(null),[r,n]=(0,t.useState)(!0),[i,s]=(0,t.useState)(null),d=!!e;(0,t.useEffect)(()=>{(async()=>{try{if(n(!0),o.isAuthenticated()){let e=await o.verifyToken();a(e)}}catch(e){console.error("Auth initialization error:",e),s("فشل في تهيئة المصادقة")}finally{n(!1)}})()},[]);let l=(0,t.useCallback)(async e=>{try{n(!0),s(null);let{user:r}=await o.login(e);a(r)}catch(e){throw s(e instanceof Error?e.message:"خطأ في تسجيل الدخول"),e}finally{n(!1)}},[]),c=(0,t.useCallback)(async()=>{try{n(!0),await o.logout(),a(null),s(null)}catch(e){console.error("Logout error:",e)}finally{n(!1)}},[]),u=(0,t.useCallback)(async e=>{try{return s(null),await o.register(e)}catch(e){throw s(e instanceof Error?e.message:"خطأ في إنشاء المستخدم"),e}},[]),f=(0,t.useCallback)(async(r,t)=>{try{s(null);let n=await o.updateUser(r,t);return e&&e.id===r&&a(n),n}catch(e){throw s(e instanceof Error?e.message:"خطأ في تحديث المستخدم"),e}},[e]),m=(0,t.useCallback)(async(e,a)=>{try{s(null),await o.changePassword(e,a)}catch(e){throw s(e instanceof Error?e.message:"خطأ في تغيير كلمة المرور"),e}},[]),g=(0,t.useCallback)((e,a)=>o.hasPermission(e,a),[]);return{user:e,isAuthenticated:d,isLoading:r,error:i,login:l,logout:c,register:u,updateUser:f,changePassword:m,hasPermission:g,hasRole:(0,t.useCallback)(e=>o.hasRole(e),[]),clearError:(0,t.useCallback)(()=>{s(null)},[])}}},2714:(e,a,r)=>{"use strict";r.d(a,{J:()=>l});var t=r(5155),n=r(2115),o=r(968),i=r(2085),s=r(3999);let d=(0,i.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),l=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.b,{ref:a,className:(0,s.cn)(d(),r),...n})});l.displayName=o.b.displayName},3999:(e,a,r)=>{"use strict";r.d(a,{cn:()=>o});var t=r(2596),n=r(9688);function o(){for(var e=arguments.length,a=Array(e),r=0;r<e;r++)a[r]=arguments[r];return(0,n.QP)((0,t.$)(a))}},4441:()=>{},4964:(e,a,r)=>{"use strict";r.d(a,{Xi:()=>l,av:()=>c,j7:()=>d,tU:()=>s});var t=r(5155),n=r(2115),o=r(64),i=r(3999);let s=o.bL,d=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.B8,{ref:a,className:(0,i.cn)("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",r),...n})});d.displayName=o.B8.displayName;let l=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.l9,{ref:a,className:(0,i.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",r),...n})});l.displayName=o.l9.displayName;let c=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.UC,{ref:a,className:(0,i.cn)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",r),...n})});c.displayName=o.UC.displayName},5512:(e,a,r)=>{"use strict";r.d(a,{lG:()=>d,Cf:()=>f,rr:()=>b,Es:()=>g,c7:()=>m,L3:()=>p,zM:()=>l});var t=r(5155),n=r(2115),o=r(1642),i=r(4416),s=r(3999);let d=o.bL,l=o.l9,c=o.ZL;o.bm;let u=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.hJ,{ref:a,className:(0,s.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",r),...n})});u.displayName=o.hJ.displayName;let f=n.forwardRef((e,a)=>{let{className:r,children:n,...d}=e;return(0,t.jsxs)(c,{children:[(0,t.jsx)(u,{}),(0,t.jsxs)(o.UC,{ref:a,className:(0,s.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",r),...d,children:[n,(0,t.jsxs)(o.bm,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,t.jsx)(i.A,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});f.displayName=o.UC.displayName;let m=e=>{let{className:a,...r}=e;return(0,t.jsx)("div",{className:(0,s.cn)("flex flex-col space-y-1.5 text-center sm:text-left",a),...r})};m.displayName="DialogHeader";let g=e=>{let{className:a,...r}=e;return(0,t.jsx)("div",{className:(0,s.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...r})};g.displayName="DialogFooter";let p=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.hE,{ref:a,className:(0,s.cn)("text-lg font-semibold leading-none tracking-tight",r),...n})});p.displayName=o.hE.displayName;let b=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.VY,{ref:a,className:(0,s.cn)("text-sm text-muted-foreground",r),...n})});b.displayName=o.VY.displayName},7168:(e,a,r)=>{"use strict";r.d(a,{$:()=>l});var t=r(5155),n=r(2115),o=r(9708),i=r(2085),s=r(3999);let d=(0,i.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),l=n.forwardRef((e,a)=>{let{className:r,variant:n,size:i,asChild:l=!1,...c}=e,u=l?o.DX:"button";return(0,t.jsx)(u,{className:(0,s.cn)(d({variant:n,size:i,className:r})),ref:a,...c})});l.displayName="Button"},7271:(e,a,r)=>{"use strict";r.d(a,{B:()=>c});var t=r(2115);let n={},o="ar",i=!1,s={ar:{common:{loading:"جارٍ التحميل...",save:"حفظ",cancel:"إلغاء",delete:"حذف",edit:"تعديل",add:"إضافة",view:"عرض",home:"الرئيسية",services:"الخدمات",about:"من نحن",contact:"اتصل بنا"},navigation:{home:"الرئيسية",services:"خدماتنا",about:"من نحن",contact:"اتصل بنا"}},en:{common:{loading:"Loading...",save:"Save",cancel:"Cancel",delete:"Delete",edit:"Edit",add:"Add",view:"View",home:"Home",services:"Services",about:"About",contact:"Contact"},navigation:{home:"Home",services:"Services",about:"About",contact:"Contact"}}},d=async function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ar";try{o=e,document.documentElement.lang=e,document.documentElement.dir="ar"===e?"rtl":"ltr",n=s[e]||s.ar,i=!0;let a=await fetch(`/i18n/${e}.json`);a.ok?(n=await a.json(),localStorage.setItem("preferred-language",e)):console.warn(`Failed to load translations for ${e}, using fallback`)}catch(a){console.warn("Error loading translations, using fallback:",a),n=s[e]||s.ar,i=!0}},l=async e=>{if(e!==o||!i){await d(e);{let a=new CustomEvent("languageChanged",{detail:{language:e,translations:n}});window.dispatchEvent(a)}}};function c(){let[e,a]=(0,t.useState)(()=>localStorage.getItem("preferred-language")||o||"ar"),[r,s]=(0,t.useState)(!0),[c,u]=(0,t.useState)(!1);(0,t.useEffect)(()=>{c||(async()=>{try{await d(e),u(!0),s(!1)}catch(e){console.warn("Translation initialization failed:",e),u(!0),s(!1)}})()},[e,c]);let f=(0,t.useCallback)(async r=>{if(r!==e){s(!0),u(!1);try{await l(r),a(r)}catch(e){console.warn("Language change failed:",e)}finally{s(!1)}}},[e]);return{t:(0,t.useCallback)((e,a)=>((e,a)=>{if(!i)return d(o),e;let r=e.split("."),t=n;for(let a of r)if(!t||"object"!=typeof t||!(a in t))return e;else t=t[a];return"string"!=typeof t?e:a?t.replace(/\{(\w+)\}/g,(e,r)=>a[r]?.toString()||e):t})(e,a),[e]),currentLanguage:e,changeLanguage:f,switchLanguage:f,isLoading:r,isRTL:"ar"===e}}d(localStorage.getItem("preferred-language")||"ar")},8011:(e,a,r)=>{"use strict";r.d(a,{QZ:()=>w,ph:()=>k,lk:()=>N});var t=r(5155),n=r(2115),o=r(8482),i=r(7168),s=r(8145),d=r(5339),l=r(1243),c=r(3861);r(1690);var u=r(5196),f=r(1284),m=r(1497),g=r(9420),p=r(4416),b=r(7271),h=r(515);let y={enabled:!0,soundEnabled:!0,desktopNotifications:!0,showBadges:!0,autoMarkAsRead:!1,maxNotifications:50,defaultDismissTime:5e3,types:{success:{enabled:!0,sound:!0,desktop:!1,priority:"low"},error:{enabled:!0,sound:!0,desktop:!0,priority:"high"},warning:{enabled:!0,sound:!0,desktop:!0,priority:"medium"},info:{enabled:!0,sound:!1,desktop:!1,priority:"low"},message:{enabled:!0,sound:!0,desktop:!0,priority:"medium"},booking:{enabled:!0,sound:!0,desktop:!0,priority:"high"},payment:{enabled:!0,sound:!0,desktop:!0,priority:"high"},system:{enabled:!0,sound:!1,desktop:!0,priority:"medium"}}},x=(0,n.createContext)(void 0);function k(e){let{children:a,maxNotifications:r=50,defaultDismissTime:o=5e3}=e,[i,s]=(0,n.useState)([]),[d,l]=(0,n.useState)(y),[c,u]=(0,n.useState)(new Set);(0,n.useEffect)(()=>{let e=localStorage.getItem("app-notifications"),a=localStorage.getItem("notification-settings");if(e)try{s(JSON.parse(e))}catch(e){console.error("خطأ في تحميل الإشعارات:",e)}if(a)try{l({...y,...JSON.parse(a)})}catch(e){console.error("خطأ في تحميل إعدادات الإشعارات:",e)}"Notification"in window&&d.desktopNotifications&&Notification.requestPermission()},[]),(0,n.useEffect)(()=>{localStorage.setItem("app-notifications",JSON.stringify(i))},[i]),(0,n.useEffect)(()=>{localStorage.setItem("notification-settings",JSON.stringify(d))},[d]),(0,n.useEffect)(()=>{let e={};return i.forEach(a=>{if(a.autoDismiss&&!a.persistent&&!e[a.id]){let r=a.dismissAfter||o;e[a.id]=setTimeout(()=>{f(a.id)},r)}}),()=>{Object.values(e).forEach(e=>clearTimeout(e))}},[i,o]);let f=e=>{s(a=>a.filter(a=>a.id!==e))},m=i.filter(e=>!e.read).length;return(0,t.jsx)(x.Provider,{value:{notifications:i,unreadCount:m,addNotification:e=>{let a=`notification-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,t=new Date().toISOString(),n={...e,id:a,timestamp:t,read:!1};return d.enabled&&d.types[n.type]?.enabled&&(s(e=>[n,...e].slice(0,r)),d.soundEnabled&&d.types[n.type]?.sound&&(e=>{try{new Audio;let a=new(window.AudioContext||window.webkitAudioContext),r=a.createOscillator(),t=a.createGain();r.connect(t),t.connect(a.destination),r.frequency.setValueAtTime("error"===e?400:"warning"===e?600:800,a.currentTime),r.type="sine",t.gain.setValueAtTime(.1,a.currentTime),t.gain.exponentialRampToValueAtTime(.01,a.currentTime+.3),r.start(a.currentTime),r.stop(a.currentTime+.3)}catch(e){console.warn("تعذر تشغيل صوت الإشعار:",e)}})(n.type),d.desktopNotifications&&d.types[n.type]?.desktop&&"Notification"in window&&"granted"===Notification.permission&&new Notification(n.title,{body:n.message,icon:{success:"/icons/success.png",error:"/icons/error.png",warning:"/icons/warning.png",info:"/icons/info.png",message:"/icons/message.png",booking:"/icons/booking.png",payment:"/icons/payment.png",system:"/icons/system.png"}[n.type]||"/icons/default.png",tag:n.id}),c.forEach(e=>e(n))),a},removeNotification:f,markAsRead:e=>{s(a=>a.map(a=>a.id===e?{...a,read:!0}:a))},markAsUnread:e=>{s(a=>a.map(a=>a.id===e?{...a,read:!1}:a))},markAllAsRead:()=>{s(e=>e.map(e=>({...e,read:!0})))},clearAllNotifications:()=>{s([])},getNotificationsByType:e=>i.filter(a=>a.type===e),getNotificationsByPriority:e=>i.filter(a=>a.priority===e),subscribe:e=>(u(a=>new Set([...a,e])),()=>{u(a=>{let r=new Set(a);return r.delete(e),r})}),settings:d,updateSettings:e=>{l(a=>({...a,...e}))}},children:a})}let v=()=>{let e=(0,n.useContext)(x);if(void 0===e)throw Error("useNotifications must be used within a NotificationProvider");return e};function w(e){let{position:a="top-right",maxVisible:r=5,className:n=""}=e,{notifications:y,removeNotification:x,markAsRead:k}=v(),{t:w,currentLanguage:N}=(0,b.B)(),{isAnimationEnabled:D}=(0,h.s)(),j=y.filter(e=>e.autoDismiss||e.persistent).slice(0,r);return 0===j.length?null:(0,t.jsx)("div",{className:`fixed z-50 ${{"top-right":"top-4 right-4","top-left":"top-4 left-4","bottom-right":"bottom-4 right-4","bottom-left":"bottom-4 left-4","top-center":"top-4 left-1/2 transform -translate-x-1/2","bottom-center":"bottom-4 left-1/2 transform -translate-x-1/2"}[a]} ${n}`,children:(0,t.jsx)("div",{className:"space-y-2 w-80",children:j.map(e=>{var a;let r=(a=e.type,({success:u.A,error:d.A,warning:l.A,info:f.A,message:m.A,booking:c.A,payment:g.A,system:f.A})[a]||f.A),n=(e=>{let a={success:"border-green-200 bg-green-50 text-green-800",error:"border-red-200 bg-red-50 text-red-800",warning:"border-yellow-200 bg-yellow-50 text-yellow-800",info:"border-blue-200 bg-blue-50 text-blue-800",message:"border-purple-200 bg-purple-50 text-purple-800",booking:"border-indigo-200 bg-indigo-50 text-indigo-800",payment:"border-emerald-200 bg-emerald-50 text-emerald-800",system:"border-gray-200 bg-gray-50 text-gray-800"};return a[e]||a.info})(e.type);return(0,t.jsx)(o.Zp,{className:`${n} shadow-lg transition-all duration-300 ${D()?"animate-slide-left":""}`,children:(0,t.jsx)(o.Wu,{className:"p-4",children:(0,t.jsxs)("div",{className:"flex items-start space-x-3",children:[(0,t.jsx)(r,{className:"w-5 h-5 mt-1 flex-shrink-0"}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("h4",{className:"text-sm font-medium truncate",children:"ar"===N?e.titleAr:e.title}),(0,t.jsxs)("div",{className:"flex items-center space-x-1 ml-2",children:["urgent"===e.priority&&(0,t.jsx)(s.E,{variant:"destructive",className:"text-xs",children:"عاجل"}),"high"===e.priority&&(0,t.jsx)(s.E,{variant:"secondary",className:"text-xs",children:"مهم"}),(0,t.jsx)(i.$,{variant:"ghost",size:"sm",onClick:()=>x(e.id),className:"h-6 w-6 p-0",children:(0,t.jsx)(p.A,{className:"w-4 h-4"})})]})]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:"ar"===N?e.messageAr:e.message}),e.actions&&(0,t.jsx)("div",{className:"flex space-x-2 mt-3",children:e.actions.map(a=>(0,t.jsxs)(i.$,{variant:a.variant||"outline",size:"sm",onClick:()=>a.action(e),className:"text-xs h-7",children:[a.icon&&(0,t.jsx)(a.icon,{className:"w-3 h-3 mr-1"}),"ar"===N?a.labelAr:a.label]},a.id))}),(0,t.jsxs)("div",{className:"flex items-center justify-between mt-2",children:[(0,t.jsx)("span",{className:"text-xs text-muted-foreground",children:new Date(e.timestamp).toLocaleTimeString("ar")}),!e.read&&(0,t.jsx)(i.$,{variant:"ghost",size:"sm",onClick:()=>k(e.id),className:"text-xs h-6",children:"تم القراءة"})]})]})]})})},e.id)})})})}function N(){let{addNotification:e}=v();return{success:(a,r,t,n)=>e({type:"success",title:a,titleAr:t||a,message:r,messageAr:n||r,priority:"low",category:"General",categoryAr:"عام",actionable:!1,autoDismiss:!0}),error:(a,r,t,n)=>e({type:"error",title:a,titleAr:t||a,message:r,messageAr:n||r,priority:"high",category:"Error",categoryAr:"خطأ",actionable:!1,autoDismiss:!0}),warning:(a,r,t,n)=>e({type:"warning",title:a,titleAr:t||a,message:r,messageAr:n||r,priority:"medium",category:"Warning",categoryAr:"تحذير",actionable:!1,autoDismiss:!0}),info:(a,r,t,n)=>e({type:"info",title:a,titleAr:t||a,message:r,messageAr:n||r,priority:"low",category:"Information",categoryAr:"معلومات",actionable:!1,autoDismiss:!0}),message:(a,r,t,n,o)=>e({type:"message",title:a,titleAr:t||a,message:r,messageAr:n||r,priority:"medium",category:"Message",categoryAr:"رسالة",actionable:!!o,actions:o,autoDismiss:!1,persistent:!0})}}},8145:(e,a,r)=>{"use strict";r.d(a,{E:()=>s});var t=r(5155);r(2115);var n=r(2085),o=r(3999);let i=(0,n.F)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function s(e){let{className:a,variant:r,...n}=e;return(0,t.jsx)("div",{className:(0,o.cn)(i({variant:r}),a),...n})}},8482:(e,a,r)=>{"use strict";r.d(a,{BT:()=>l,Wu:()=>c,ZB:()=>d,Zp:()=>i,aR:()=>s});var t=r(5155),n=r(2115),o=r(3999);let i=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("div",{ref:a,className:(0,o.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",r),...n})});i.displayName="Card";let s=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("div",{ref:a,className:(0,o.cn)("flex flex-col space-y-1.5 p-6",r),...n})});s.displayName="CardHeader";let d=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("h3",{ref:a,className:(0,o.cn)("text-2xl font-semibold leading-none tracking-tight",r),...n})});d.displayName="CardTitle";let l=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("p",{ref:a,className:(0,o.cn)("text-sm text-muted-foreground",r),...n})});l.displayName="CardDescription";let c=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("div",{ref:a,className:(0,o.cn)("p-6 pt-0",r),...n})});c.displayName="CardContent",n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("div",{ref:a,className:(0,o.cn)("flex items-center p-6 pt-0",r),...n})}).displayName="CardFooter"},9393:()=>{},9474:(e,a,r)=>{"use strict";r.d(a,{T:()=>i});var t=r(5155),n=r(2115),o=r(3999);let i=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)("textarea",{className:(0,o.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:a,...n})});i.displayName="Textarea"},9847:(e,a,r)=>{"use strict";r.d(a,{ThemeProvider:()=>c,DP:()=>l});var t=r(5155),n=r(2115);let o={oceanBlue:{id:"oceanBlue",name:{ar:"أزرق المحيط",en:"Ocean Blue"},description:{ar:"ثيم أزرق هادئ مستوحى من المحيط",en:"Calm blue theme inspired by the ocean"},light:{primary:"#2563eb",primaryDark:"#1d4ed8",primaryLight:"#3b82f6",secondary:"#06b6d4",secondaryDark:"#0891b2",secondaryLight:"#22d3ee",accent:"#0ea5e9",accentDark:"#0284c7",accentLight:"#38bdf8",neutral:"#64748b",neutralDark:"#475569",neutralLight:"#94a3b8",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#f8fafc",surface:"#f1f5f9",surfaceDark:"#e2e8f0",text:"#0f172a",textDark:"#334155",textSecondary:"#64748b",textSecondaryDark:"#94a3b8",border:"#e2e8f0",borderDark:"#cbd5e1"},dark:{primary:"#3b82f6",primaryDark:"#2563eb",primaryLight:"#60a5fa",secondary:"#22d3ee",secondaryDark:"#06b6d4",secondaryLight:"#67e8f9",accent:"#38bdf8",accentDark:"#0ea5e9",accentLight:"#7dd3fc",neutral:"#94a3b8",neutralDark:"#64748b",neutralLight:"#cbd5e1",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#0f172a",backgroundDark:"#020617",surface:"#1e293b",surfaceDark:"#334155",text:"#f8fafc",textDark:"#e2e8f0",textSecondary:"#cbd5e1",textSecondaryDark:"#94a3b8",border:"#334155",borderDark:"#475569"},gradient:{primary:"linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",secondary:"linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)"},shadows:{sm:"0 1px 2px 0 rgb(59 130 246 / 0.05)",md:"0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",lg:"0 10px 15px -3px rgb(59 130 246 / 0.1), 0 4px 6px -4px rgb(59 130 246 / 0.1)",xl:"0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}},forestGreen:{id:"forestGreen",name:{ar:"أخضر الغابة",en:"Forest Green"},description:{ar:"ثيم أخضر طبيعي مستوحى من الغابات",en:"Natural green theme inspired by forests"},light:{primary:"#059669",primaryDark:"#047857",primaryLight:"#10b981",secondary:"#84cc16",secondaryDark:"#65a30d",secondaryLight:"#a3e635",accent:"#22c55e",accentDark:"#16a34a",accentLight:"#4ade80",neutral:"#6b7280",neutralDark:"#4b5563",neutralLight:"#9ca3af",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#f9fafb",surface:"#f3f4f6",surfaceDark:"#e5e7eb",text:"#111827",textDark:"#374151",textSecondary:"#6b7280",textSecondaryDark:"#9ca3af",border:"#e5e7eb",borderDark:"#d1d5db"},dark:{primary:"#10b981",primaryDark:"#059669",primaryLight:"#34d399",secondary:"#a3e635",secondaryDark:"#84cc16",secondaryLight:"#bef264",accent:"#4ade80",accentDark:"#22c55e",accentLight:"#86efac",neutral:"#9ca3af",neutralDark:"#6b7280",neutralLight:"#d1d5db",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#111827",backgroundDark:"#030712",surface:"#1f2937",surfaceDark:"#374151",text:"#f9fafb",textDark:"#e5e7eb",textSecondary:"#d1d5db",textSecondaryDark:"#9ca3af",border:"#374151",borderDark:"#4b5563"},gradient:{primary:"linear-gradient(135deg, #059669 0%, #84cc16 100%)",secondary:"linear-gradient(135deg, #22c55e 0%, #a3e635 100%)"},shadows:{sm:"0 1px 2px 0 rgb(16 185 129 / 0.05)",md:"0 4px 6px -1px rgb(16 185 129 / 0.1), 0 2px 4px -2px rgb(16 185 129 / 0.1)",lg:"0 10px 15px -3px rgb(16 185 129 / 0.1), 0 4px 6px -4px rgb(16 185 129 / 0.1)",xl:"0 20px 25px -5px rgb(16 185 129 / 0.1), 0 8px 10px -6px rgb(16 185 129 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}},steelGray:{id:"steelGray",name:{ar:"رمادي الفولاذ",en:"Steel Gray"},description:{ar:"ثيم رمادي أنيق ومهني",en:"Elegant and professional gray theme"},light:{primary:"#374151",primaryDark:"#1f2937",primaryLight:"#4b5563",secondary:"#6b7280",secondaryDark:"#4b5563",secondaryLight:"#9ca3af",accent:"#8b5cf6",accentDark:"#7c3aed",accentLight:"#a78bfa",neutral:"#6b7280",neutralDark:"#4b5563",neutralLight:"#9ca3af",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#f9fafb",surface:"#f3f4f6",surfaceDark:"#e5e7eb",text:"#111827",textDark:"#374151",textSecondary:"#6b7280",textSecondaryDark:"#9ca3af",border:"#e5e7eb",borderDark:"#d1d5db"},dark:{primary:"#6b7280",primaryDark:"#374151",primaryLight:"#9ca3af",secondary:"#9ca3af",secondaryDark:"#6b7280",secondaryLight:"#d1d5db",accent:"#a78bfa",accentDark:"#8b5cf6",accentLight:"#c4b5fd",neutral:"#9ca3af",neutralDark:"#6b7280",neutralLight:"#d1d5db",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#111827",backgroundDark:"#030712",surface:"#1f2937",surfaceDark:"#374151",text:"#f9fafb",textDark:"#e5e7eb",textSecondary:"#d1d5db",textSecondaryDark:"#9ca3af",border:"#374151",borderDark:"#4b5563"},gradient:{primary:"linear-gradient(135deg, #374151 0%, #8b5cf6 100%)",secondary:"linear-gradient(135deg, #6b7280 0%, #a78bfa 100%)"},shadows:{sm:"0 1px 2px 0 rgb(55 65 81 / 0.05)",md:"0 4px 6px -1px rgb(55 65 81 / 0.1), 0 2px 4px -2px rgb(55 65 81 / 0.1)",lg:"0 10px 15px -3px rgb(55 65 81 / 0.1), 0 4px 6px -4px rgb(55 65 81 / 0.1)",xl:"0 20px 25px -5px rgb(55 65 81 / 0.1), 0 8px 10px -6px rgb(55 65 81 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}},earthCopper:{id:"earthCopper",name:{ar:"نحاسي الأرض",en:"Earth Copper"},description:{ar:"ثيم نحاسي دافئ مستوحى من الأرض",en:"Warm copper theme inspired by earth"},light:{primary:"#dc2626",primaryDark:"#b91c1c",primaryLight:"#ef4444",secondary:"#ea580c",secondaryDark:"#c2410c",secondaryLight:"#f97316",accent:"#d97706",accentDark:"#b45309",accentLight:"#f59e0b",neutral:"#78716c",neutralDark:"#57534e",neutralLight:"#a8a29e",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#fefaf8",surface:"#faf7f4",surfaceDark:"#f5f1ed",text:"#1c1917",textDark:"#44403c",textSecondary:"#78716c",textSecondaryDark:"#a8a29e",border:"#e7e5e4",borderDark:"#d6d3d1"},dark:{primary:"#ef4444",primaryDark:"#dc2626",primaryLight:"#f87171",secondary:"#f97316",secondaryDark:"#ea580c",secondaryLight:"#fb923c",accent:"#f59e0b",accentDark:"#d97706",accentLight:"#fbbf24",neutral:"#a8a29e",neutralDark:"#78716c",neutralLight:"#d6d3d1",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#1c1917",backgroundDark:"#0c0a09",surface:"#292524",surfaceDark:"#44403c",text:"#fafaf9",textDark:"#f5f5f4",textSecondary:"#d6d3d1",textSecondaryDark:"#a8a29e",border:"#44403c",borderDark:"#57534e"},gradient:{primary:"linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",secondary:"linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"},shadows:{sm:"0 1px 2px 0 rgb(220 38 38 / 0.05)",md:"0 4px 6px -1px rgb(220 38 38 / 0.1), 0 2px 4px -2px rgb(220 38 38 / 0.1)",lg:"0 10px 15px -3px rgb(220 38 38 / 0.1), 0 4px 6px -4px rgb(220 38 38 / 0.1)",xl:"0 20px 25px -5px rgb(220 38 38 / 0.1), 0 8px 10px -6px rgb(220 38 38 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}}},i={currentTheme:"oceanBlue",darkMode:!1,autoTheme:!1,customization:{enableAnimations:!0,enableShadows:!0,enableGradients:!0,enableBlur:!0,compactMode:!1,highContrast:!1}};function s(e,a){let r=o[e]||o.oceanBlue;return a?r.dark:r.light}let d=(0,n.createContext)(void 0);function l(){let e=(0,n.useContext)(d);if(!e)throw Error("useTheme must be used within a ThemeProvider");return e}function c(e){let{children:a}=e,[r,l]=(0,n.useState)(i),[c,u]=(0,n.useState)(!1),f=r.autoTheme?c:r.darkMode,m=s(r.currentTheme,f),g=o[r.currentTheme]||o.oceanBlue;(0,n.useEffect)(()=>{l(function(){{let e=localStorage.getItem("theme-settings");if(e)try{return{...i,...JSON.parse(e)}}catch(e){console.error("Error loading theme settings:",e)}}return i}()),u(window.matchMedia("(prefers-color-scheme: dark)").matches);{let e=window.matchMedia("(prefers-color-scheme: dark)"),a=e=>{u(e.matches)};return e.addEventListener("change",a),()=>e.removeEventListener("change",a)}},[]),(0,n.useEffect)(()=>{!function(e,a){if("undefined"!=typeof document){var r;let t=function(e,a){let r=s(e,a),t=o[e]||o.oceanBlue;return`
    :root {
      --color-primary: ${r.primary};
      --color-primary-dark: ${r.primaryDark};
      --color-primary-light: ${r.primaryLight};
      --color-secondary: ${r.secondary};
      --color-secondary-dark: ${r.secondaryDark};
      --color-secondary-light: ${r.secondaryLight};
      --color-accent: ${r.accent};
      --color-accent-dark: ${r.accentDark};
      --color-accent-light: ${r.accentLight};
      --color-neutral: ${r.neutral};
      --color-neutral-dark: ${r.neutralDark};
      --color-neutral-light: ${r.neutralLight};
      --color-success: ${r.success};
      --color-warning: ${r.warning};
      --color-error: ${r.error};
      --color-info: ${r.info};
      --color-background: ${r.background};
      --color-background-dark: ${r.backgroundDark};
      --color-surface: ${r.surface};
      --color-surface-dark: ${r.surfaceDark};
      --color-text: ${r.text};
      --color-text-dark: ${r.textDark};
      --color-text-secondary: ${r.textSecondary};
      --color-text-secondary-dark: ${r.textSecondaryDark};
      --color-border: ${r.border};
      --color-border-dark: ${r.borderDark};
      
      --gradient-primary: ${t.gradient?.primary||"linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)"};
      --gradient-secondary: ${t.gradient?.secondary||"linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)"};
      
      --shadow-sm: ${t.shadows?.sm||"0 1px 2px 0 rgb(0 0 0 / 0.05)"};
      --shadow-md: ${t.shadows?.md||"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"};
      --shadow-lg: ${t.shadows?.lg||"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"};
      --shadow-xl: ${t.shadows?.xl||"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"};
      
      --radius-sm: ${t.borderRadius?.sm||"0.375rem"};
      --radius-md: ${t.borderRadius?.md||"0.5rem"};
      --radius-lg: ${t.borderRadius?.lg||"0.75rem"};
      --radius-xl: ${t.borderRadius?.xl||"1rem"};
      
      --mode: ${a?"dark":"light"};
    }
    
    .theme-${e} {
      color-scheme: ${a?"dark":"light"};
    }
    
    .theme-${e}.dark {
      color-scheme: dark;
    }
  `}(e,a),n=document.getElementById("dynamic-theme-styles");n||((n=document.createElement("style")).id="dynamic-theme-styles",document.head.appendChild(n)),n.textContent=t,r=document.body,r.className=r.className.replace(/theme-\w+/g,""),r.classList.add(`theme-${e}`),a?r.classList.add("dark"):r.classList.remove("dark")}}(r.currentTheme,f),localStorage.setItem("theme-settings",JSON.stringify(r))},[r,f]);let p=(0,n.useCallback)(e=>{o[e]&&l(a=>({...a,currentTheme:e}))},[]),b=(0,n.useCallback)(e=>{l(a=>({...a,darkMode:e,autoTheme:!1}))},[]),h=(0,n.useCallback)(()=>{b(!r.darkMode)},[r.darkMode,b]),y=(0,n.useCallback)(e=>{l(a=>({...a,autoTheme:e}))},[]),x=(0,n.useCallback)(e=>{l(a=>({...a,customization:{...a.customization,...e}}))},[]),k=(0,n.useCallback)(()=>o,[]),v=(0,n.useCallback)(()=>{l(i)},[]),w=(0,n.useCallback)(()=>JSON.stringify(r,null,2),[r]),N=(0,n.useCallback)(e=>{try{let a=JSON.parse(e);if(a.currentTheme&&o[a.currentTheme])return l({...i,...a}),!0;return!1}catch(e){return console.error("Error importing theme settings:",e),!1}},[]),D={currentTheme:r.currentTheme,setCurrentTheme:p,isDarkMode:f,setDarkMode:b,toggleDarkMode:h,autoTheme:r.autoTheme,setAutoTheme:y,colors:m,theme:g,customization:r.customization,setCustomization:x,getAvailableThemes:k,resetToDefaults:v,exportSettings:w,importSettings:N};return(0,t.jsx)(d.Provider,{value:D,children:a})}},9852:(e,a,r)=>{"use strict";r.d(a,{p:()=>i});var t=r(5155),n=r(2115),o=r(3999);let i=n.forwardRef((e,a)=>{let{className:r,type:n,...i}=e;return(0,t.jsx)("input",{type:n,className:(0,o.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",r),ref:a,...i})});i.displayName="Input"},9954:(e,a,r)=>{"use strict";r.d(a,{l6:()=>c,gC:()=>p,eb:()=>b,bq:()=>f,yv:()=>u});var t=r(5155),n=r(2115),o=r(9529),i=r(5196),s=r(6474),d=r(7863),l=r(3999);let c=o.bL;o.YJ;let u=o.WT,f=n.forwardRef((e,a)=>{let{className:r,children:n,...i}=e;return(0,t.jsxs)(o.l9,{ref:a,className:(0,l.cn)("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",r),...i,children:[n,(0,t.jsx)(o.In,{asChild:!0,children:(0,t.jsx)(s.A,{className:"h-4 w-4 opacity-50"})})]})});f.displayName=o.l9.displayName;let m=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.PP,{ref:a,className:(0,l.cn)("flex cursor-default items-center justify-center py-1",r),...n,children:(0,t.jsx)(d.A,{className:"h-4 w-4"})})});m.displayName=o.PP.displayName;let g=n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.wn,{ref:a,className:(0,l.cn)("flex cursor-default items-center justify-center py-1",r),...n,children:(0,t.jsx)(s.A,{className:"h-4 w-4"})})});g.displayName=o.wn.displayName;let p=n.forwardRef((e,a)=>{let{className:r,children:n,position:i="popper",...s}=e;return(0,t.jsx)(o.ZL,{children:(0,t.jsxs)(o.UC,{ref:a,className:(0,l.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2","popper"===i&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",r),position:i,...s,children:[(0,t.jsx)(m,{}),(0,t.jsx)(o.LM,{className:(0,l.cn)("p-1","popper"===i&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:n}),(0,t.jsx)(g,{})]})})});p.displayName=o.UC.displayName,n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.JU,{ref:a,className:(0,l.cn)("py-1.5 pl-8 pr-2 text-sm font-semibold",r),...n})}).displayName=o.JU.displayName;let b=n.forwardRef((e,a)=>{let{className:r,children:n,...s}=e;return(0,t.jsxs)(o.q7,{ref:a,className:(0,l.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",r),...s,children:[(0,t.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,t.jsx)(o.VF,{children:(0,t.jsx)(i.A,{className:"h-4 w-4"})})}),(0,t.jsx)(o.p4,{children:n})]})});b.displayName=o.q7.displayName,n.forwardRef((e,a)=>{let{className:r,...n}=e;return(0,t.jsx)(o.wv,{ref:a,className:(0,l.cn)("-mx-1 my-1 h-px bg-muted",r),...n})}).displayName=o.wv.displayName}}]);
exports.id=6446,exports.ids=[6446],exports.modules={940:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,16133,23)),Promise.resolve().then(c.t.bind(c,16444,23)),Promise.resolve().then(c.t.bind(c,16042,23)),Promise.resolve().then(c.t.bind(c,49477,23)),Promise.resolve().then(c.t.bind(c,29345,23)),Promise.resolve().then(c.t.bind(c,12089,23)),Promise.resolve().then(c.t.bind(c,46577,23)),Promise.resolve().then(c.t.bind(c,31307,23)),Promise.resolve().then(c.t.bind(c,14817,23))},7259:(a,b,c)=>{Promise.resolve().then(c.bind(c,41124)),Promise.resolve().then(c.bind(c,74267))},8533:(a,b,c)=>{"use strict";c.d(b,{H:()=>h,s:()=>i});var d=c(60687),e=c(43210);let f={duration:{fast:150,normal:300,slow:500,ultra:1e3},easing:{linear:"linear",easeIn:"cubic-bezier(0.4, 0, 1, 1)",easeOut:"cubic-bezier(0, 0, 0.2, 1)",easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",bounce:"cubic-bezier(0.68, -0.55, 0.265, 1.55)",elastic:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",back:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",smooth:"cubic-bezier(0.25, 0.46, 0.45, 0.94)"},delays:{none:0,short:100,medium:200,long:500},enabled:!0,reducedMotion:!1,globalSpeed:1},g=(0,e.createContext)(void 0);function h({children:a,initialSettings:b}){let[c,h]=(0,e.useState)({...f,...b}),[i,j]=(0,e.useState)(!1),k=a=>!c.enabled||c.reducedMotion?0:Math.round(c.duration[a]*c.globalSpeed),l=a=>!c.enabled||c.reducedMotion?"linear":c.easing[a],m=a=>!c.enabled||c.reducedMotion?0:Math.round(c.delays[a]*c.globalSpeed);return(0,d.jsxs)(g.Provider,{value:{settings:c,updateSettings:a=>{h(b=>({...b,...a}))},setGlobalSpeed:a=>{h(b=>({...b,globalSpeed:Math.max(.1,Math.min(5,a))}))},enableAnimations:a=>{h(b=>({...b,enabled:a}))},getDuration:k,getEasing:l,getDelay:m,createTransition:(a,b="normal",d="easeInOut",e="none")=>{if(!c.enabled||c.reducedMotion)return"none";let f=k(b),g=l(d),h=m(e);return`${a} ${f}ms ${g} ${h}ms`},isAnimationEnabled:()=>c.enabled&&!c.reducedMotion},children:[a,i&&(0,d.jsx)("style",{suppressHydrationWarning:!0,children:`
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
          `})]})}let i=()=>{let a=(0,e.useContext)(g);if(void 0===a)throw Error("useAnimation must be used within an AnimationController");return a}},24934:(a,b,c)=>{"use strict";c.d(b,{$:()=>j});var d=c(60687),e=c(43210),f=c(8730),g=c(24224),h=c(96241);let i=(0,g.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),j=e.forwardRef(({className:a,variant:b,size:c,asChild:e=!1,...g},j)=>{let k=e?f.DX:"button";return(0,d.jsx)(k,{className:(0,h.cn)(i({variant:b,size:c,className:a})),ref:j,...g})});j.displayName="Button"},33599:(a,b,c)=>{"use strict";c.d(b,{l8:()=>e,vQ:()=>d});let d={name:"عالم النظافة",nameAr:"عالم النظافة جدة",nameEn:"Cleaning World Jeddah",domain:"https://cw.com.sa",phone:"+966500000000",email:"info@cleaningworld.sa",version:"1.0.0"},e={defaultTitle:"عالم النظافة جدة - شريككم الموثوق لخدمات التنظيف المحترفة",description:"نستخدم أحدث المعدات العالمية مع فريق من المتخصصين المدربين لضمان أعلى معايير النظافة والجودة في جدة",keywords:["تنظيف","تنظيف منازل","تنظيف مكاتب","جدة","السعودية","خدمات تنظيف","شركة تنظيف"],openGraph:{type:"website",locale:"ar_SA",url:"https://cw.com.sa",siteName:"عالم النظافة جدة"},twitter:{card:"summary_large_image",site:"@cleaningworld",creator:"@cleaningworld"}}},41124:(a,b,c)=>{"use strict";c.d(b,{default:()=>d});let d=(0,c(61369).registerClientReference)(function(){throw Error("Attempted to call the default export of \"D:\\\\Github\\\\cw\\\\components\\\\ClientProviders.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\components\\ClientProviders.tsx","default")},46328:(a,b,c)=>{"use strict";c.d(b,{ThemeProvider:()=>j,DP:()=>i});var d=c(60687),e=c(43210);let f={oceanBlue:{id:"oceanBlue",name:{ar:"أزرق المحيط",en:"Ocean Blue"},description:{ar:"ثيم أزرق هادئ مستوحى من المحيط",en:"Calm blue theme inspired by the ocean"},light:{primary:"#2563eb",primaryDark:"#1d4ed8",primaryLight:"#3b82f6",secondary:"#06b6d4",secondaryDark:"#0891b2",secondaryLight:"#22d3ee",accent:"#0ea5e9",accentDark:"#0284c7",accentLight:"#38bdf8",neutral:"#64748b",neutralDark:"#475569",neutralLight:"#94a3b8",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#f8fafc",surface:"#f1f5f9",surfaceDark:"#e2e8f0",text:"#0f172a",textDark:"#334155",textSecondary:"#64748b",textSecondaryDark:"#94a3b8",border:"#e2e8f0",borderDark:"#cbd5e1"},dark:{primary:"#3b82f6",primaryDark:"#2563eb",primaryLight:"#60a5fa",secondary:"#22d3ee",secondaryDark:"#06b6d4",secondaryLight:"#67e8f9",accent:"#38bdf8",accentDark:"#0ea5e9",accentLight:"#7dd3fc",neutral:"#94a3b8",neutralDark:"#64748b",neutralLight:"#cbd5e1",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#0f172a",backgroundDark:"#020617",surface:"#1e293b",surfaceDark:"#334155",text:"#f8fafc",textDark:"#e2e8f0",textSecondary:"#cbd5e1",textSecondaryDark:"#94a3b8",border:"#334155",borderDark:"#475569"},gradient:{primary:"linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",secondary:"linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)"},shadows:{sm:"0 1px 2px 0 rgb(59 130 246 / 0.05)",md:"0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",lg:"0 10px 15px -3px rgb(59 130 246 / 0.1), 0 4px 6px -4px rgb(59 130 246 / 0.1)",xl:"0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}},forestGreen:{id:"forestGreen",name:{ar:"أخضر الغابة",en:"Forest Green"},description:{ar:"ثيم أخضر طبيعي مستوحى من الغابات",en:"Natural green theme inspired by forests"},light:{primary:"#059669",primaryDark:"#047857",primaryLight:"#10b981",secondary:"#84cc16",secondaryDark:"#65a30d",secondaryLight:"#a3e635",accent:"#22c55e",accentDark:"#16a34a",accentLight:"#4ade80",neutral:"#6b7280",neutralDark:"#4b5563",neutralLight:"#9ca3af",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#f9fafb",surface:"#f3f4f6",surfaceDark:"#e5e7eb",text:"#111827",textDark:"#374151",textSecondary:"#6b7280",textSecondaryDark:"#9ca3af",border:"#e5e7eb",borderDark:"#d1d5db"},dark:{primary:"#10b981",primaryDark:"#059669",primaryLight:"#34d399",secondary:"#a3e635",secondaryDark:"#84cc16",secondaryLight:"#bef264",accent:"#4ade80",accentDark:"#22c55e",accentLight:"#86efac",neutral:"#9ca3af",neutralDark:"#6b7280",neutralLight:"#d1d5db",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#111827",backgroundDark:"#030712",surface:"#1f2937",surfaceDark:"#374151",text:"#f9fafb",textDark:"#e5e7eb",textSecondary:"#d1d5db",textSecondaryDark:"#9ca3af",border:"#374151",borderDark:"#4b5563"},gradient:{primary:"linear-gradient(135deg, #059669 0%, #84cc16 100%)",secondary:"linear-gradient(135deg, #22c55e 0%, #a3e635 100%)"},shadows:{sm:"0 1px 2px 0 rgb(16 185 129 / 0.05)",md:"0 4px 6px -1px rgb(16 185 129 / 0.1), 0 2px 4px -2px rgb(16 185 129 / 0.1)",lg:"0 10px 15px -3px rgb(16 185 129 / 0.1), 0 4px 6px -4px rgb(16 185 129 / 0.1)",xl:"0 20px 25px -5px rgb(16 185 129 / 0.1), 0 8px 10px -6px rgb(16 185 129 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}},steelGray:{id:"steelGray",name:{ar:"رمادي الفولاذ",en:"Steel Gray"},description:{ar:"ثيم رمادي أنيق ومهني",en:"Elegant and professional gray theme"},light:{primary:"#374151",primaryDark:"#1f2937",primaryLight:"#4b5563",secondary:"#6b7280",secondaryDark:"#4b5563",secondaryLight:"#9ca3af",accent:"#8b5cf6",accentDark:"#7c3aed",accentLight:"#a78bfa",neutral:"#6b7280",neutralDark:"#4b5563",neutralLight:"#9ca3af",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#f9fafb",surface:"#f3f4f6",surfaceDark:"#e5e7eb",text:"#111827",textDark:"#374151",textSecondary:"#6b7280",textSecondaryDark:"#9ca3af",border:"#e5e7eb",borderDark:"#d1d5db"},dark:{primary:"#6b7280",primaryDark:"#374151",primaryLight:"#9ca3af",secondary:"#9ca3af",secondaryDark:"#6b7280",secondaryLight:"#d1d5db",accent:"#a78bfa",accentDark:"#8b5cf6",accentLight:"#c4b5fd",neutral:"#9ca3af",neutralDark:"#6b7280",neutralLight:"#d1d5db",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#111827",backgroundDark:"#030712",surface:"#1f2937",surfaceDark:"#374151",text:"#f9fafb",textDark:"#e5e7eb",textSecondary:"#d1d5db",textSecondaryDark:"#9ca3af",border:"#374151",borderDark:"#4b5563"},gradient:{primary:"linear-gradient(135deg, #374151 0%, #8b5cf6 100%)",secondary:"linear-gradient(135deg, #6b7280 0%, #a78bfa 100%)"},shadows:{sm:"0 1px 2px 0 rgb(55 65 81 / 0.05)",md:"0 4px 6px -1px rgb(55 65 81 / 0.1), 0 2px 4px -2px rgb(55 65 81 / 0.1)",lg:"0 10px 15px -3px rgb(55 65 81 / 0.1), 0 4px 6px -4px rgb(55 65 81 / 0.1)",xl:"0 20px 25px -5px rgb(55 65 81 / 0.1), 0 8px 10px -6px rgb(55 65 81 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}},earthCopper:{id:"earthCopper",name:{ar:"نحاسي الأرض",en:"Earth Copper"},description:{ar:"ثيم نحاسي دافئ مستوحى من الأرض",en:"Warm copper theme inspired by earth"},light:{primary:"#dc2626",primaryDark:"#b91c1c",primaryLight:"#ef4444",secondary:"#ea580c",secondaryDark:"#c2410c",secondaryLight:"#f97316",accent:"#d97706",accentDark:"#b45309",accentLight:"#f59e0b",neutral:"#78716c",neutralDark:"#57534e",neutralLight:"#a8a29e",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6",background:"#ffffff",backgroundDark:"#fefaf8",surface:"#faf7f4",surfaceDark:"#f5f1ed",text:"#1c1917",textDark:"#44403c",textSecondary:"#78716c",textSecondaryDark:"#a8a29e",border:"#e7e5e4",borderDark:"#d6d3d1"},dark:{primary:"#ef4444",primaryDark:"#dc2626",primaryLight:"#f87171",secondary:"#f97316",secondaryDark:"#ea580c",secondaryLight:"#fb923c",accent:"#f59e0b",accentDark:"#d97706",accentLight:"#fbbf24",neutral:"#a8a29e",neutralDark:"#78716c",neutralLight:"#d6d3d1",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa",background:"#1c1917",backgroundDark:"#0c0a09",surface:"#292524",surfaceDark:"#44403c",text:"#fafaf9",textDark:"#f5f5f4",textSecondary:"#d6d3d1",textSecondaryDark:"#a8a29e",border:"#44403c",borderDark:"#57534e"},gradient:{primary:"linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",secondary:"linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"},shadows:{sm:"0 1px 2px 0 rgb(220 38 38 / 0.05)",md:"0 4px 6px -1px rgb(220 38 38 / 0.1), 0 2px 4px -2px rgb(220 38 38 / 0.1)",lg:"0 10px 15px -3px rgb(220 38 38 / 0.1), 0 4px 6px -4px rgb(220 38 38 / 0.1)",xl:"0 20px 25px -5px rgb(220 38 38 / 0.1), 0 8px 10px -6px rgb(220 38 38 / 0.1)"},borderRadius:{sm:"0.375rem",md:"0.5rem",lg:"0.75rem",xl:"1rem"}}},g={currentTheme:"oceanBlue",darkMode:!1,autoTheme:!1,customization:{enableAnimations:!0,enableShadows:!0,enableGradients:!0,enableBlur:!0,compactMode:!1,highContrast:!1}},h=(0,e.createContext)(void 0);function i(){let a=(0,e.useContext)(h);if(!a)throw Error("useTheme must be used within a ThemeProvider");return a}function j({children:a}){let[b,c]=(0,e.useState)(g),[i,j]=(0,e.useState)(!1),k=b.autoTheme?i:b.darkMode,l=function(a,b){let c=f[a]||f.oceanBlue;return b?c.dark:c.light}(b.currentTheme,k),m=f[b.currentTheme]||f.oceanBlue,n=(0,e.useCallback)(a=>{f[a]&&c(b=>({...b,currentTheme:a}))},[]),o=(0,e.useCallback)(a=>{c(b=>({...b,darkMode:a,autoTheme:!1}))},[]),p=(0,e.useCallback)(()=>{o(!b.darkMode)},[b.darkMode,o]),q=(0,e.useCallback)(a=>{c(b=>({...b,autoTheme:a}))},[]),r=(0,e.useCallback)(a=>{c(b=>({...b,customization:{...b.customization,...a}}))},[]),s=(0,e.useCallback)(()=>f,[]),t=(0,e.useCallback)(()=>{c(g)},[]),u=(0,e.useCallback)(()=>JSON.stringify(b,null,2),[b]),v=(0,e.useCallback)(a=>{try{let b=JSON.parse(a);if(b.currentTheme&&f[b.currentTheme])return c({...g,...b}),!0;return!1}catch(a){return console.error("Error importing theme settings:",a),!1}},[]),w={currentTheme:b.currentTheme,setCurrentTheme:n,isDarkMode:k,setDarkMode:o,toggleDarkMode:p,autoTheme:b.autoTheme,setAutoTheme:q,colors:l,theme:m,customization:b.customization,setCustomization:r,getAvailableThemes:s,resetToDefaults:t,exportSettings:u,importSettings:v};return(0,d.jsx)(h.Provider,{value:w,children:a})}},50093:(a,b,c)=>{"use strict";c.d(b,{cy:()=>g,As:()=>h,hD:()=>i});var d=c(43210);class e{constructor(){this.tokenKey="auth_token",this.baseUrl="http://localhost:3000/api"}async login(a){try{let b=await fetch(`${this.baseUrl}/auth/login?debug=1`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!b.ok){let a="بيانات تسجيل الدخول غير صحيحة";try{let c=await b.json();if(c?.error&&(a=c.error),c?.debug){let b=Error(a);throw b.debug=c.debug,b}}catch(a){}throw Error(a)}let c=await b.json();return this.setToken(c.token),c}catch(a){throw console.error("Login error:",a),a}}async logout(){try{await fetch(`${this.baseUrl}/auth/logout`,{method:"POST",headers:{Authorization:`Bearer ${this.getToken()}`}})}catch(a){console.error("Logout error:",a)}finally{this.removeToken()}}async verifyToken(){let a=this.getToken();if(!a)return null;try{let b=await fetch(`${this.baseUrl}/auth/verify`,{headers:{Authorization:`Bearer ${a}`}});if(!b.ok)return this.removeToken(),null;return await b.json()}catch(a){return console.error("Token verification error:",a),this.removeToken(),null}}getToken(){return null}setToken(a){}removeToken(){}isAuthenticated(){return!!this.getToken()}}let f=new e,g=(0,d.createContext)(null);function h(){let a=(0,d.useContext)(g);if(!a)throw Error("useAuth must be used within an AuthProvider");return a}function i(){let[a,b]=(0,d.useState)(null),[c,e]=(0,d.useState)(!0),[g,h]=(0,d.useState)(null),i=!!a,j=(0,d.useCallback)(async a=>{try{e(!0),h(null);let{user:c}=await f.login(a);b(c)}catch(a){throw h(a instanceof Error?a.message:"خطأ في تسجيل الدخول"),a}finally{e(!1)}},[]),k=(0,d.useCallback)(async()=>{try{e(!0),await f.logout(),b(null),h(null)}catch(a){console.error("Logout error:",a)}finally{e(!1)}},[]),l=(0,d.useCallback)(async a=>{try{return h(null),await f.register(a)}catch(a){throw h(a instanceof Error?a.message:"خطأ في إنشاء المستخدم"),a}},[]),m=(0,d.useCallback)(async(c,d)=>{try{h(null);let e=await f.updateUser(c,d);return a&&a.id===c&&b(e),e}catch(a){throw h(a instanceof Error?a.message:"خطأ في تحديث المستخدم"),a}},[a]),n=(0,d.useCallback)(async(a,b)=>{try{h(null),await f.changePassword(a,b)}catch(a){throw h(a instanceof Error?a.message:"خطأ في تغيير كلمة المرور"),a}},[]),o=(0,d.useCallback)((a,b)=>f.hasPermission(a,b),[]);return{user:a,isAuthenticated:i,isLoading:c,error:g,login:j,logout:k,register:l,updateUser:m,changePassword:n,hasPermission:o,hasRole:(0,d.useCallback)(a=>f.hasRole(a),[]),clearError:(0,d.useCallback)(()=>{h(null)},[])}}},55192:(a,b,c)=>{"use strict";c.d(b,{BT:()=>j,Wu:()=>k,ZB:()=>i,Zp:()=>g,aR:()=>h});var d=c(60687),e=c(43210),f=c(96241);let g=e.forwardRef(({className:a,...b},c)=>(0,d.jsx)("div",{ref:c,className:(0,f.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...b}));g.displayName="Card";let h=e.forwardRef(({className:a,...b},c)=>(0,d.jsx)("div",{ref:c,className:(0,f.cn)("flex flex-col space-y-1.5 p-6",a),...b}));h.displayName="CardHeader";let i=e.forwardRef(({className:a,...b},c)=>(0,d.jsx)("h3",{ref:c,className:(0,f.cn)("text-2xl font-semibold leading-none tracking-tight",a),...b}));i.displayName="CardTitle";let j=e.forwardRef(({className:a,...b},c)=>(0,d.jsx)("p",{ref:c,className:(0,f.cn)("text-sm text-muted-foreground",a),...b}));j.displayName="CardDescription";let k=e.forwardRef(({className:a,...b},c)=>(0,d.jsx)("div",{ref:c,className:(0,f.cn)("p-6 pt-0",a),...b}));k.displayName="CardContent",e.forwardRef(({className:a,...b},c)=>(0,d.jsx)("div",{ref:c,className:(0,f.cn)("flex items-center p-6 pt-0",a),...b})).displayName="CardFooter"},57018:(a,b,c)=>{"use strict";c.d(b,{B:()=>j});var d=c(43210);let e="ar",f=!1,g={ar:{common:{loading:"جارٍ التحميل...",save:"حفظ",cancel:"إلغاء",delete:"حذف",edit:"تعديل",add:"إضافة",view:"عرض",home:"الرئيسية",services:"الخدمات",about:"من نحن",contact:"اتصل بنا"},navigation:{home:"الرئيسية",services:"خدماتنا",about:"من نحن",contact:"اتصل بنا"}},en:{common:{loading:"Loading...",save:"Save",cancel:"Cancel",delete:"Delete",edit:"Edit",add:"Add",view:"View",home:"Home",services:"Services",about:"About",contact:"Contact"},navigation:{home:"Home",services:"Services",about:"About",contact:"Contact"}}},h=async(a="ar")=>{e=a,g[a]||g.ar,f=!0},i=async a=>{a===e&&f||await h(a)};function j(){let[a,b]=(0,d.useState)(()=>"ar"),[c,e]=(0,d.useState)(!0),[f,g]=(0,d.useState)(!1),h=(0,d.useCallback)(async c=>{if(c!==a){e(!0),g(!1);try{await i(c),b(c)}catch(a){console.warn("Language change failed:",a)}finally{e(!1)}}},[a]);return{t:(0,d.useCallback)((a,b)=>a,[a]),currentLanguage:a,changeLanguage:h,switchLanguage:h,isLoading:c,isRTL:"ar"===a}}},58014:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>n,metadata:()=>l,viewport:()=>m});var d=c(37413),e=c(13346),f=c.n(e),g=c(30588),h=c.n(g);c(82704);var i=c(41124),j=c(74267),k=c(33599);let l={title:k.l8.defaultTitle,description:k.l8.description,keywords:[...k.l8.keywords],authors:[{name:k.vQ.name,url:k.vQ.domain}],creator:k.vQ.name,publisher:k.vQ.name,formatDetection:{email:!1,address:!1,telephone:!1},metadataBase:new URL(k.vQ.domain),alternates:{canonical:"/",languages:{"ar-SA":"/ar","en-US":"/en"}},openGraph:{...k.l8.openGraph,title:k.l8.defaultTitle,description:k.l8.description},twitter:{...k.l8.twitter,title:k.l8.defaultTitle,description:k.l8.description},robots:{index:!0,follow:!0,googleBot:{index:!0,follow:!0,"max-video-preview":-1,"max-image-preview":"large","max-snippet":-1}},verification:{google:"your-google-site-verification",yandex:"your-yandex-verification",yahoo:"your-yahoo-verification"},category:"business"},m={themeColor:[{media:"(prefers-color-scheme: light)",color:"white"},{media:"(prefers-color-scheme: dark)",color:"black"}],width:"device-width",initialScale:1,maximumScale:5,userScalable:!0};function n({children:a}){return(0,d.jsxs)("html",{lang:"ar",dir:"rtl",className:`${f().variable} ${h().variable}`,children:[(0,d.jsxs)("head",{children:[(0,d.jsx)("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),(0,d.jsx)("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),(0,d.jsx)("link",{rel:"dns-prefetch",href:"//fonts.googleapis.com"}),(0,d.jsx)("link",{rel:"dns-prefetch",href:"//fonts.gstatic.com"}),(0,d.jsx)("meta",{name:"mobile-web-app-capable",content:"yes"}),(0,d.jsx)("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),(0,d.jsx)("meta",{name:"apple-mobile-web-app-status-bar-style",content:"default"}),(0,d.jsx)("meta",{name:"apple-mobile-web-app-title",content:k.vQ.name}),(0,d.jsx)("meta",{name:"application-name",content:k.vQ.name}),(0,d.jsx)("meta",{name:"msapplication-TileColor",content:"#2563eb"}),(0,d.jsx)("meta",{name:"theme-color",content:"#ffffff"}),(0,d.jsx)("link",{rel:"apple-touch-icon",sizes:"180x180",href:"/apple-touch-icon.png"}),(0,d.jsx)("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/favicon-32x32.png"}),(0,d.jsx)("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/favicon-16x16.png"}),(0,d.jsx)("link",{rel:"manifest",href:"/site.webmanifest"}),(0,d.jsx)("link",{rel:"mask-icon",href:"/safari-pinned-tab.svg",color:"#2563eb"})]}),(0,d.jsxs)("body",{className:`${f().className} font-sans antialiased min-h-screen transition-colors duration-300`,children:[(0,d.jsx)(j.ThemeProvider,{children:(0,d.jsx)(i.default,{children:a})}),(0,d.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify({"@context":"https://schema.org","@type":"LocalBusiness",name:k.vQ.name,alternateName:k.vQ.nameAr,description:k.l8.description,url:k.vQ.domain,telephone:k.vQ.phone,email:k.vQ.email,address:{"@type":"PostalAddress",addressLocality:"Riyadh",addressCountry:"SA"},geo:{"@type":"GeoCoordinates",latitude:"24.7136",longitude:"46.6753"},sameAs:["https://facebook.com/cleaningworld","https://twitter.com/cleaningworld","https://instagram.com/cleaningworld"],serviceType:"Cleaning Services",areaServed:{"@type":"Country",name:"Saudi Arabia"}})}})]})]})}},59821:(a,b,c)=>{"use strict";c.d(b,{E:()=>h});var d=c(60687);c(43210);var e=c(24224),f=c(96241);let g=(0,e.F)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function h({className:a,variant:b,...c}){return(0,d.jsx)("div",{className:(0,f.cn)(g({variant:b}),a),...c})}},60403:(a,b,c)=>{Promise.resolve().then(c.bind(c,70035)),Promise.resolve().then(c.bind(c,46328))},70035:(a,b,c)=>{"use strict";c.d(b,{default:()=>i});var d=c(60687);c(43210);var e=c(73205),f=c(8533),g=c(50093);function h({children:a}){let b=(0,g.hD)();return(0,d.jsx)(g.cy.Provider,{value:b,children:a})}function i({children:a}){return(0,d.jsx)(h,{children:(0,d.jsx)(f.H,{children:(0,d.jsxs)(e.ph,{children:[a,(0,d.jsx)(e.QZ,{})]})})})}},73205:(a,b,c)=>{"use strict";c.d(b,{QZ:()=>w,lk:()=>x,ph:()=>u});var d=c(60687),e=c(43210),f=c(55192),g=c(24934),h=c(59821),i=c(13964),j=c(93613),k=c(43649),l=c(96882),m=c(58887),n=c(97051),o=c(48340),p=c(11860),q=c(57018),r=c(8533);let s={enabled:!0,soundEnabled:!0,desktopNotifications:!0,showBadges:!0,autoMarkAsRead:!1,maxNotifications:50,defaultDismissTime:5e3,types:{success:{enabled:!0,sound:!0,desktop:!1,priority:"low"},error:{enabled:!0,sound:!0,desktop:!0,priority:"high"},warning:{enabled:!0,sound:!0,desktop:!0,priority:"medium"},info:{enabled:!0,sound:!1,desktop:!1,priority:"low"},message:{enabled:!0,sound:!0,desktop:!0,priority:"medium"},booking:{enabled:!0,sound:!0,desktop:!0,priority:"high"},payment:{enabled:!0,sound:!0,desktop:!0,priority:"high"},system:{enabled:!0,sound:!1,desktop:!0,priority:"medium"}}},t=(0,e.createContext)(void 0);function u({children:a,maxNotifications:b=50,defaultDismissTime:c=5e3}){let[f,g]=(0,e.useState)([]),[h,i]=(0,e.useState)(s),[j,k]=(0,e.useState)(new Set),l=f.filter(a=>!a.read).length;return(0,d.jsx)(t.Provider,{value:{notifications:f,unreadCount:l,addNotification:a=>{let c=`notification-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,d=new Date().toISOString(),e={...a,id:c,timestamp:d,read:!1};return h.enabled&&h.types[e.type]?.enabled&&(g(a=>[e,...a].slice(0,b)),h.soundEnabled&&h.types[e.type]?.sound&&(a=>{try{new Audio;let b=new(window.AudioContext||window.webkitAudioContext),c=b.createOscillator(),d=b.createGain();c.connect(d),d.connect(b.destination),c.frequency.setValueAtTime("error"===a?400:"warning"===a?600:800,b.currentTime),c.type="sine",d.gain.setValueAtTime(.1,b.currentTime),d.gain.exponentialRampToValueAtTime(.01,b.currentTime+.3),c.start(b.currentTime),c.stop(b.currentTime+.3)}catch(a){console.warn("تعذر تشغيل صوت الإشعار:",a)}})(e.type),h.desktopNotifications&&h.types[e.type]?.desktop&&"Notification"in window&&"granted"===Notification.permission&&new Notification(e.title,{body:e.message,icon:{success:"/icons/success.png",error:"/icons/error.png",warning:"/icons/warning.png",info:"/icons/info.png",message:"/icons/message.png",booking:"/icons/booking.png",payment:"/icons/payment.png",system:"/icons/system.png"}[e.type]||"/icons/default.png",tag:e.id}),j.forEach(a=>a(e))),c},removeNotification:a=>{g(b=>b.filter(b=>b.id!==a))},markAsRead:a=>{g(b=>b.map(b=>b.id===a?{...b,read:!0}:b))},markAsUnread:a=>{g(b=>b.map(b=>b.id===a?{...b,read:!1}:b))},markAllAsRead:()=>{g(a=>a.map(a=>({...a,read:!0})))},clearAllNotifications:()=>{g([])},getNotificationsByType:a=>f.filter(b=>b.type===a),getNotificationsByPriority:a=>f.filter(b=>b.priority===a),subscribe:a=>(k(b=>new Set([...b,a])),()=>{k(b=>{let c=new Set(b);return c.delete(a),c})}),settings:h,updateSettings:a=>{i(b=>({...b,...a}))}},children:a})}let v=()=>{let a=(0,e.useContext)(t);if(void 0===a)throw Error("useNotifications must be used within a NotificationProvider");return a};function w({position:a="top-right",maxVisible:b=5,className:c=""}){let{notifications:e,removeNotification:s,markAsRead:t}=v(),{t:u,currentLanguage:w}=(0,q.B)(),{isAnimationEnabled:x}=(0,r.s)(),y=e.filter(a=>a.autoDismiss||a.persistent).slice(0,b);return 0===y.length?null:(0,d.jsx)("div",{className:`fixed z-50 ${{"top-right":"top-4 right-4","top-left":"top-4 left-4","bottom-right":"bottom-4 right-4","bottom-left":"bottom-4 left-4","top-center":"top-4 left-1/2 transform -translate-x-1/2","bottom-center":"bottom-4 left-1/2 transform -translate-x-1/2"}[a]} ${c}`,children:(0,d.jsx)("div",{className:"space-y-2 w-80",children:y.map(a=>{var b;let c=(b=a.type,({success:i.A,error:j.A,warning:k.A,info:l.A,message:m.A,booking:n.A,payment:o.A,system:l.A})[b]||l.A),e=(a=>{let b={success:"border-green-200 bg-green-50 text-green-800",error:"border-red-200 bg-red-50 text-red-800",warning:"border-yellow-200 bg-yellow-50 text-yellow-800",info:"border-blue-200 bg-blue-50 text-blue-800",message:"border-purple-200 bg-purple-50 text-purple-800",booking:"border-indigo-200 bg-indigo-50 text-indigo-800",payment:"border-emerald-200 bg-emerald-50 text-emerald-800",system:"border-gray-200 bg-gray-50 text-gray-800"};return b[a]||b.info})(a.type);return(0,d.jsx)(f.Zp,{className:`${e} shadow-lg transition-all duration-300 ${x()?"animate-slide-left":""}`,children:(0,d.jsx)(f.Wu,{className:"p-4",children:(0,d.jsxs)("div",{className:"flex items-start space-x-3",children:[(0,d.jsx)(c,{className:"w-5 h-5 mt-1 flex-shrink-0"}),(0,d.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,d.jsxs)("div",{className:"flex items-center justify-between",children:[(0,d.jsx)("h4",{className:"text-sm font-medium truncate",children:"ar"===w?a.titleAr:a.title}),(0,d.jsxs)("div",{className:"flex items-center space-x-1 ml-2",children:["urgent"===a.priority&&(0,d.jsx)(h.E,{variant:"destructive",className:"text-xs",children:"عاجل"}),"high"===a.priority&&(0,d.jsx)(h.E,{variant:"secondary",className:"text-xs",children:"مهم"}),(0,d.jsx)(g.$,{variant:"ghost",size:"sm",onClick:()=>s(a.id),className:"h-6 w-6 p-0",children:(0,d.jsx)(p.A,{className:"w-4 h-4"})})]})]}),(0,d.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:"ar"===w?a.messageAr:a.message}),a.actions&&(0,d.jsx)("div",{className:"flex space-x-2 mt-3",children:a.actions.map(b=>(0,d.jsxs)(g.$,{variant:b.variant||"outline",size:"sm",onClick:()=>b.action(a),className:"text-xs h-7",children:[b.icon&&(0,d.jsx)(b.icon,{className:"w-3 h-3 mr-1"}),"ar"===w?b.labelAr:b.label]},b.id))}),(0,d.jsxs)("div",{className:"flex items-center justify-between mt-2",children:[(0,d.jsx)("span",{className:"text-xs text-muted-foreground",children:new Date(a.timestamp).toLocaleTimeString("ar")}),!a.read&&(0,d.jsx)(g.$,{variant:"ghost",size:"sm",onClick:()=>t(a.id),className:"text-xs h-6",children:"تم القراءة"})]})]})]})})},a.id)})})})}function x(){let{addNotification:a}=v();return{success:(b,c,d,e)=>a({type:"success",title:b,titleAr:d||b,message:c,messageAr:e||c,priority:"low",category:"General",categoryAr:"عام",actionable:!1,autoDismiss:!0}),error:(b,c,d,e)=>a({type:"error",title:b,titleAr:d||b,message:c,messageAr:e||c,priority:"high",category:"Error",categoryAr:"خطأ",actionable:!1,autoDismiss:!0}),warning:(b,c,d,e)=>a({type:"warning",title:b,titleAr:d||b,message:c,messageAr:e||c,priority:"medium",category:"Warning",categoryAr:"تحذير",actionable:!1,autoDismiss:!0}),info:(b,c,d,e)=>a({type:"info",title:b,titleAr:d||b,message:c,messageAr:e||c,priority:"low",category:"Information",categoryAr:"معلومات",actionable:!1,autoDismiss:!0}),message:(b,c,d,e,f)=>a({type:"message",title:b,titleAr:d||b,message:c,messageAr:e||c,priority:"medium",category:"Message",categoryAr:"رسالة",actionable:!!f,actions:f,autoDismiss:!1,persistent:!0})}}},74267:(a,b,c)=>{"use strict";c.d(b,{ThemeProvider:()=>e});var d=c(61369);(0,d.registerClientReference)(function(){throw Error("Attempted to call useTheme() from the server but useTheme is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\hooks\\useTheme.tsx","useTheme");let e=(0,d.registerClientReference)(function(){throw Error("Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\hooks\\useTheme.tsx","ThemeProvider");(0,d.registerClientReference)(function(){throw Error("Attempted to call useThemeColors() from the server but useThemeColors is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\hooks\\useTheme.tsx","useThemeColors"),(0,d.registerClientReference)(function(){throw Error("Attempted to call useDarkMode() from the server but useDarkMode is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\hooks\\useTheme.tsx","useDarkMode"),(0,d.registerClientReference)(function(){throw Error("Attempted to call useThemeClasses() from the server but useThemeClasses is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\hooks\\useTheme.tsx","useThemeClasses"),(0,d.registerClientReference)(function(){throw Error("Attempted to call useThemeControl() from the server but useThemeControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\Github\\cw\\hooks\\useTheme.tsx","useThemeControl")},82704:()=>{},87788:(a,b,c)=>{Promise.resolve().then(c.t.bind(c,25227,23)),Promise.resolve().then(c.t.bind(c,86346,23)),Promise.resolve().then(c.t.bind(c,27924,23)),Promise.resolve().then(c.t.bind(c,40099,23)),Promise.resolve().then(c.t.bind(c,38243,23)),Promise.resolve().then(c.t.bind(c,28827,23)),Promise.resolve().then(c.t.bind(c,62763,23)),Promise.resolve().then(c.t.bind(c,97173,23)),Promise.resolve().then(c.bind(c,25587))},96241:(a,b,c)=>{"use strict";c.d(b,{cn:()=>f});var d=c(49384),e=c(82348);function f(...a){return(0,e.QP)((0,d.$)(a))}}};
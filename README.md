<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>LushAura — Interactive README</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#fbf6f7;--card:#fff;--ink:#2a1233;--mute:#6d5a74;--line:#e9dce9;--plum:#3b1646;--gold:#e8a200;--leaf:#2f6b4f;--code:#2a1233;--codeink:#f6e9f8;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17091d;--card:#241030;--ink:#f5e9f7;--mute:#b79cc0;--line:#3c2349;--plum:#d9b3e6;--gold:#f2b632;--leaf:#6fcf9f;--code:#0f0514;--codeink:#f6e9f8}}
:root[data-theme="dark"]{--bg:#17091d;--card:#241030;--ink:#f5e9f7;--mute:#b79cc0;--line:#3c2349;--plum:#d9b3e6;--gold:#f2b632;--leaf:#6fcf9f;--code:#0f0514;--codeink:#f6e9f8}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:70px}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 Manrope,system-ui,sans-serif}
h1,h2,h3{font-family:"Cormorant Garamond",Georgia,serif;line-height:1.1;margin:0}
a{color:var(--plum)}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.top{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);display:flex;gap:14px;align-items:center;padding:10px 18px}
.top b{font-family:"Cormorant Garamond",serif;font-size:22px;color:var(--plum)}
.top nav{display:flex;gap:4px;overflow-x:auto;flex:1}
.top nav a{white-space:nowrap;text-decoration:none;color:var(--mute);padding:6px 11px;border-radius:99px;font-size:14px}
.top nav a.on{background:var(--plum);color:var(--bg)}
.tbtn{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:99px;padding:6px 12px;cursor:pointer;font:inherit;font-size:13px}
main{max-width:920px;margin:0 auto;padding:0 18px 80px}
.hero{padding:56px 0 30px}
.hero h1{font-size:clamp(44px,8vw,84px);color:var(--plum);letter-spacing:-.01em}
.hero p{max-width:60ch;color:var(--mute);font-size:18px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{background:var(--card);border:1px solid var(--line);border-radius:99px;padding:4px 12px;font-size:13px}
.note{border-left:4px solid var(--gold);background:var(--card);padding:12px 16px;border-radius:0 10px 10px 0;margin:22px 0;font-size:15px}
section{padding-top:56px}
h2{font-size:clamp(30px,5vw,44px);color:var(--plum);margin-bottom:6px}
.sub{color:var(--mute);margin:0 0 20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
pre,code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13.5px}
code{background:color-mix(in srgb,var(--gold) 18%,transparent);padding:1px 6px;border-radius:5px}
.cb{position:relative;background:var(--code);color:var(--codeink);border-radius:10px;margin:10px 0}
.cb pre{margin:0;padding:14px 70px 14px 14px;overflow-x:auto;white-space:pre}
.cp{position:absolute;top:8px;right:8px;background:#ffffff1f;color:#fff;border:0;border-radius:7px;padding:4px 10px;cursor:pointer;font:inherit;font-size:12px}
.cp.ok{background:var(--leaf)}
.cred{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 0;border-bottom:1px dashed var(--line)}
.cred:last-child{border:0}.cred span{color:var(--mute);font-size:14px}
.copyv{cursor:pointer;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:8px;padding:3px 10px;font:inherit;font-family:ui-monospace,monospace;font-size:13px}
.copyv.ok{border-color:var(--leaf);color:var(--leaf)}
.tabs{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.tab{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:99px;padding:7px 16px;cursor:pointer;font:inherit}
.tab[aria-selected=true]{background:var(--plum);color:var(--bg);border-color:var(--plum)}
input[type=search],input[type=number],select{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);font:inherit}
.feat{list-style:none;margin:12px 0 0;padding:0}
.feat li{padding:9px 0;border-bottom:1px solid var(--line)}
.feat li[hidden]{display:none}
.steps{counter-reset:s;list-style:none;padding:0;margin:0}
.step{border:1px solid var(--line);background:var(--card);border-radius:14px;margin-bottom:10px;padding:14px 16px}
.step>label{display:flex;gap:12px;align-items:flex-start;cursor:pointer;font-weight:700}
.step input{width:20px;height:20px;accent-color:var(--leaf);margin-top:3px}
.step.done{opacity:.6}.step.done>label span{text-decoration:line-through}
.prog{height:8px;background:var(--line);border-radius:9px;overflow:hidden;margin:0 0 16px}
.prog i{display:block;height:100%;width:0;background:var(--leaf);transition:width .3s}
table{width:100%;border-collapse:collapse;font-size:14.5px}
td,th{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
.scroll{overflow-x:auto}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;margin-bottom:8px;padding:2px 16px}
details[hidden]{display:none}
summary{cursor:pointer;padding:12px 0;font-weight:700}
.calc{display:grid;gap:14px;grid-template-columns:1fr 1fr}
@media(max-width:640px){.calc{grid-template-columns:1fr}}
.coupons{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}
.coupons button{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:8px;padding:5px 10px;cursor:pointer;font:inherit;font-size:13px}
.coupons button[aria-pressed=true]{background:var(--gold);color:#2a1233;border-color:var(--gold)}
.sum div{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed var(--line)}
.sum .tot{font-weight:700;font-size:19px;border:0}
.msg{font-size:13px;color:var(--mute);min-height:20px}
.tree{white-space:pre;overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;line-height:1.5}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.prog i{transition:none}}
</style>
</head>
<body>
<header class="top">
  <b>LushAura</b>
  <nav id="nav">
    <a href="#demo">Demo logins</a><a href="#features">Features</a><a href="#pricing">Try pricing</a><a href="#setup">Setup</a><a href="#scripts">Scripts</a><a href="#structure">Structure</a><a href="#help">Troubleshooting</a>
  </nav>
  <button class="tbtn" id="theme" aria-label="Toggle dark mode">Dark mode</button>
</header>

<main>
<div class="hero">
  <h1>LushAura</h1>
  <p>Premium Indian gifts and clean beauty — a client-ready direct-to-consumer store demo. Handcrafted hampers, personalised gifts and Ayurveda-inspired cosmetics, from catalogue to cart, checkout, order tracking, cancellations and refunds, with an admin panel to run it all.</p>
  <div class="chips"><span class="chip">Next.js 16</span><span class="chip">TypeScript</span><span class="chip">Tailwind v4</span><span class="chip">Prisma 7</span><span class="chip">PostgreSQL 16</span></div>
  <div class="note"><b>Everything involving money or phones is simulated.</b> OTPs are fixed, payments run through a demo gateway with Simulate success / failure buttons, and no real orders are fulfilled. Pricing, stock, coupons, order lifecycle, GST invoices and SEO work as they would in production.</div>
  <p>Build progress is tracked phase by phase in <a href="docs/CHECKLIST.md">docs/CHECKLIST.md</a>.</p>
</div>

<section id="demo">
  <h2>Demo credentials</h2>
  <p class="sub">Click any value to copy it. Demo only — change or remove these before a real deployment.</p>
  <div class="card">
    <div class="cred"><span>Customer login (<code>/login</code>)</span><div><button class="copyv" data-c="9876543210">9876543210</button> <button class="copyv" data-c="123456">OTP 123456</button></div></div>
    <div class="cred"><span>Any valid Indian mobile number works and creates a new customer</span></div>
    <div class="cred"><span>Admin login (<code>/admin/login</code>)</span><div><button class="copyv" data-c="admin@lushaura.in">admin@lushaura.in</button> <button class="copyv" data-c="Admin@123">Admin@123</button></div></div>
    <div class="cred"><span>Test card (display only — nothing is sent to the server)</span><button class="copyv" data-c="4111 1111 1111 1111">4111 1111 1111 1111</button></div>
    <div class="cred"><span>Coupons</span><div><button class="copyv" data-c="WELCOME10">WELCOME10</button> <button class="copyv" data-c="FESTIVE500">FESTIVE500</button> <button class="copyv" data-c="FREESHIP">FREESHIP</button> <button class="copyv" data-c="GIFTING15">GIFTING15</button></div></div>
    <div class="cred"><span>Payments: pick UPI, card, net banking or wallet, then press Simulate success or Simulate failure. Cash on Delivery confirms instantly.</span></div>
  </div>
  <p class="sub" style="margin-top:12px">Seeded rules: free shipping on ₹999+, otherwise ₹79 · COD fee ₹49 · gift wrap ₹59 with a handwritten note. Admins change these under Admin → Settings.</p>
</section>

<section id="features">
  <h2>Features</h2>
  <p class="sub">Switch between the storefront and the admin panel, or search for a feature.</p>
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" aria-selected="true" data-t="store">Storefront</button>
    <button class="tab" role="tab" aria-selected="false" data-t="admin">Admin panel (/admin)</button>
  </div>
  <input type="search" id="fq" placeholder="Search features, e.g. invoice, coupons, SEO" aria-label="Search features">
  <ul class="feat" id="feat"></ul>
  <p class="msg" id="fmsg"></p>
</section>

<section id="pricing">
  <h2>Try the pricing rules</h2>
  <p class="sub">A quick calculator using the seeded store rules and coupons, so you can see what a customer would pay.</p>
  <div class="card calc">
    <div>
      <label for="sub">Cart subtotal (₹)</label>
      <input type="number" id="sub" value="1500" min="0" step="50">
      <div class="coupons" id="cps" role="group" aria-label="Coupons"></div>
      <label><input type="checkbox" id="cod"> Cash on Delivery</label><br>
      <label><input type="checkbox" id="gw"> Gift wrap + handwritten note</label>
      <p class="msg" id="cmsg"></p>
    </div>
    <div class="sum" id="sum"></div>
  </div>
</section>

<section id="setup">
  <h2>Quick start</h2>
  <p class="sub">Tick each step as you go. You need Node.js 20.9+ (22 LTS recommended), npm and PostgreSQL 16 running locally (Postgres.app, Homebrew <code>postgresql@16</code> or Docker).</p>
  <div class="prog"><i id="bar"></i></div>
  <ol class="steps" id="steps"></ol>
  <h3 style="font-size:28px;margin:26px 0 8px">Environment variables</h3>
  <div class="card scroll"><table>
    <tr><th>Variable</th><th>Purpose</th></tr>
    <tr><td><code>DATABASE_URL</code></td><td>PostgreSQL connection string</td></tr>
    <tr><td><code>SESSION_SECRET</code></td><td>Signs session cookies (16+ characters; required in production)</td></tr>
    <tr><td><code>NEXT_PUBLIC_SITE_URL</code></td><td>Public base URL for canonical URLs, sitemap and Open Graph</td></tr>
    <tr><td><code>UPLOAD_DIR</code></td><td>Where admin-uploaded product images live (default <code>./uploads</code>)</td></tr>
  </table></div>
  <p class="sub" style="margin-top:12px">Want fresh demo data? Run <code>npm run db:reset</code> to drop, re-migrate and re-seed.</p>
</section>

<section id="scripts">
  <h2>npm scripts</h2>
  <p class="sub">Filter by name, then copy the command.</p>
  <input type="search" id="sq" placeholder="Filter scripts, e.g. db, build" aria-label="Filter scripts">
  <div class="grid" id="scr" style="margin-top:12px"></div>
</section>

<section id="structure">
  <h2>Project structure</h2>
  <p class="sub">Tap a folder to see what it holds.</p>
  <div class="grid" id="tree"></div>
  <p class="msg" style="margin-top:10px">Architecture notes live in <a href="docs/ARCHITECTURE.md">docs/ARCHITECTURE.md</a>; coding rules are in <a href="docs/CONVENTIONS.md">docs/CONVENTIONS.md</a>.</p>
  <h3 style="font-size:28px;margin:22px 0 8px">Replacing images</h3>
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" aria-selected="true" data-i="banner">Banners</button>
    <button class="tab" role="tab" aria-selected="false" data-i="product">Products</button>
  </div>
  <div class="card" id="img"></div>
</section>

<section id="help">
  <h2>Troubleshooting</h2>
  <p class="sub">Type the error or a keyword to narrow the list.</p>
  <input type="search" id="tq" placeholder="e.g. postmaster, DATABASE_URL, admin" aria-label="Search troubleshooting">
  <div id="ts" style="margin-top:12px"></div>
  <p class="msg" id="tmsg"></p>
</section>

<section id="docs">
  <h2>Documentation</h2>
  <div class="grid">
    <a class="card" href="docs/CHECKLIST.md">CHECKLIST — phased build tracker</a>
    <a class="card" href="docs/ARCHITECTURE.md">ARCHITECTURE — rendering, auth, order state machine, SEO, security</a>
    <a class="card" href="docs/DATA-MODEL.md">DATA-MODEL — Prisma models, ER diagram, money rules</a>
    <a class="card" href="docs/USER-FLOWS.md">USER-FLOWS — click-through demo script</a>
    <a class="card" href="docs/ROUTES.md">ROUTES — every route and its auth rule</a>
    <a class="card" href="docs/DESIGN-SYSTEM.md">DESIGN-SYSTEM — tokens, type, components</a>
    <a class="card" href="docs/CONVENTIONS.md">CONVENTIONS — code rules for contributors</a>
  </div>
  <p class="msg" style="margin-top:28px">© LushAura Lifestyle Private Limited (fictional brand for demonstration). Not a real store — no orders are fulfilled.</p>
</section>
</main>

<script>
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function copy(t,b,label){try{navigator.clipboard.writeText(t)}catch(e){}
  const o=b.textContent;b.textContent='Copied';b.classList.add('ok');setTimeout(()=>{b.textContent=o;b.classList.remove('ok')},1200)}
document.addEventListener('click',e=>{const v=e.target.closest('.copyv');if(v)copy(v.dataset.c,v);const c=e.target.closest('.cp');if(c)copy(c.dataset.c,c)});
const cb=c=>`<div class="cb"><pre>${c.replace(/</g,'&lt;')}</pre><button class="cp" data-c="${c.replace(/"/g,'&quot;')}">Copy</button></div>`;

/* theme */
$('#theme').onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).getPropertyValue('--bg').trim()==='#17091d';r.dataset.theme=d?'light':'dark';$('#theme').textContent=d?'Dark mode':'Light mode'};

/* features */
const F={store:["Home with hero, category tiles, bestsellers, occasions, festive banner and brand story","Catalogue: Shop All, Gifts, Cosmetics and category pages with filters (price, rating, skin type, occasion, recipient, in stock), sort, pagination and a mobile filter drawer","Search with debounced autocomplete in the header and a full results page","Product detail: gallery, MRP vs price, stock status, PIN code check, offers, ingredients, how to use, what's inside, reviews, related products, Product and Breadcrumb JSON-LD","Wishlist and cart (kept in the browser), free-shipping progress, coupon, gift wrap and gift message","Checkout: mobile-OTP login, saved addresses, coupon, payment method, demo payment modal, confirmation","My Account: overview, profile, orders with timeline and courier tracking, cancellation requests, refund status, printable GST tax invoice, address book","Public order tracking at /track (order number + mobile number)","Content and policies: Our Story, Contact (saves messages), FAQs (FAQPage JSON-LD), Shipping, Returns and Refunds, Privacy (DPDP Act 2023-aware), Terms","SEO: per-page metadata, canonical URLs, sitemap.xml, robots.txt, Open Graph image, favicon, JSON-LD","Branded 404, error and loading states; mobile-first and accessible"],
admin:["Dashboard: KPIs, 30-day revenue chart, orders by status, recent orders, low stock, pending actions, top sellers","Orders: search, status tabs, filters, CSV export; order detail with status changes, courier + AWB, tracking updates and full timeline","Cancellations approval queue, Refunds processing and Payments ledger","Products: list, create and edit with image upload, archive; Inventory with inline stock adjustments","Customers list and detail","Coupons CRUD and Reviews moderation","Store settings: fees, thresholds, COD toggle, announcement bar, support contacts"]};
let tab='store';
function drawF(){const q=$('#fq').value.toLowerCase();let n=0;
  $('#feat').innerHTML=F[tab].map(t=>{const h=q&&!t.toLowerCase().includes(q);if(!h)n++;return `<li ${h?'hidden':''}>${t}</li>`}).join('');
  $('#fmsg').textContent=n?'':'No match in this tab — try the other one.'}
$$('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;$$('[data-t]').forEach(x=>x.setAttribute('aria-selected',x===b));drawF()});
$('#fq').oninput=drawF;drawF();

/* pricing */
const CP={WELCOME10:{min:499,pct:10,cap:300,t:'10% off above ₹499, up to ₹300'},FESTIVE500:{min:2999,flat:500,t:'₹500 off above ₹2,999'},FREESHIP:{ship:1,t:'Free shipping'},GIFTING15:{min:1999,pct:15,cap:750,t:'15% off above ₹1,999, up to ₹750'}};
let cp='';
$('#cps').innerHTML=Object.keys(CP).map(k=>`<button aria-pressed="false" data-k="${k}">${k}</button>`).join('');
$('#cps').onclick=e=>{const b=e.target.closest('button');if(!b)return;cp=cp===b.dataset.k?'':b.dataset.k;calc()};
['#sub','#cod','#gw'].forEach(s=>$(s).oninput=calc);
const ₹=n=>'₹'+Math.round(n).toLocaleString('en-IN');
function calc(){const s=+$('#sub').value||0;let d=0,ship=s>=999?0:79,m='';
  $$('#cps button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===cp));
  if(cp){const c=CP[cp];if(c.ship)ship=0;else if(s<c.min)m=`${cp} needs a subtotal of ${₹(c.min)} or more.`;else d=c.flat||Math.min(s*c.pct/100,c.cap);if(!m)m=c.t+' applied.'}
  const cod=$('#cod').checked?49:0,gw=$('#gw').checked?59:0;
  $('#cmsg').textContent=m;
  $('#sum').innerHTML=`<div><span>Subtotal</span><span>${₹(s)}</span></div><div><span>Coupon</span><span>−${₹(d)}</span></div><div><span>Shipping</span><span>${ship?₹(ship):'Free'}</span></div><div><span>COD fee</span><span>${₹(cod)}</span></div><div><span>Gift wrap</span><span>${₹(gw)}</span></div><div class="tot"><span>Total</span><span>${₹(s-d+ship+cod+gw)}</span></div>`}
calc();

/* setup */
const S=[["Clone and install","Postinstall runs prisma generate for you.","git clone <repo-url> lushaura\ncd lushaura\nnpm install"],
["Configure the environment","Edit .env and set DATABASE_URL and SESSION_SECRET. Example: postgresql://postgres:postgres@localhost:5432/lushaura?schema=public","cp .env.example .env\nopenssl rand -hex 32   # use the output as SESSION_SECRET"],
["Create the database and load demo data","Skip createdb if the database already exists.","createdb lushaura\nnpx prisma migrate dev\nnpx prisma db seed"],
["Run the app","Store at localhost:3000, admin at localhost:3000/admin/login.","npm run dev"]];
$('#steps').innerHTML=S.map((s,i)=>`<li class="step"><label><input type="checkbox" data-i="${i}"><span>${s[0]}</span></label><p class="msg" style="margin:6px 0 0 32px">${s[1]}</p><div style="margin-left:32px">${cb(s[2])}</div></li>`).join('');
$('#steps').onchange=e=>{e.target.closest('.step').classList.toggle('done',e.target.checked);const n=$$('#steps input:checked').length;$('#bar').style.width=n/S.length*100+'%'};

/* scripts */
const SC=[["npm run dev","Start the dev server (Turbopack) on port 3000"],["npm run build","Production build"],["npm start","Serve the production build"],["npm run lint","ESLint"],["npm run typecheck","tsc --noEmit"],["npm run db:migrate","prisma migrate dev — apply or create migrations"],["npm run db:seed","Load demo categories, products, customers, orders and coupons"],["npm run db:reset","Drop the database, re-apply migrations and re-seed"],["npm run db:studio","Open Prisma Studio to browse data"]];
function drawS(){const q=$('#sq').value.toLowerCase();$('#scr').innerHTML=SC.filter(s=>(s[0]+s[1]).toLowerCase().includes(q)).map(s=>`<div class="card"><b>${s[0]}</b><p class="msg" style="margin:4px 0 0">${s[1]}</p>${cb(s[0])}</div>`).join('')||'<p class="msg">No script matches.</p>'}
$('#sq').oninput=drawS;drawS();

/* structure */
const T=[["prisma/","schema.prisma (data model), migrations/ (SQL), seed.ts and seed/ (demo data)"],["src/app/(store)/","Storefront routes with header and footer layout"],["src/app/admin/","login/ for sign-in; (panel)/ for admin-only routes with a sidebar"],["src/app/api/","Route handlers: search autocomplete, admin image upload, orders CSV export"],["src/app/invoice/ and uploads/","Printable GST invoice (no store chrome); serves files from UPLOAD_DIR"],["src/components/","ui, layout, product, catalog, cart, checkout, account, admin, content, common"],["src/config/","site.ts (brand, nav, demo credentials) and media.ts (banner images)"],["src/lib/ and src/hooks/","db, auth, pricing, format, validators, order-status; use-cart.ts (cart and wishlist in localStorage)"],["src/server/","catalog, orders (state machine), settings, storage, admin queries; actions/ holds one 'use server' file per domain"],["src/proxy.ts","Optimistic route guard for /account and /admin"],["docs/","Architecture, data model, routes, user flows, design system, conventions, checklist"]];
$('#tree').innerHTML=T.map(t=>`<details><summary><code>${t[0]}</code></summary><p style="margin:0 0 12px">${t[1]}</p></details>`).join('');

/* images */
const IM={banner:`<p>All hero, banner, category-tile and editorial photos live in <code>src/config/media.ts</code>. The demo uses unbranded Unsplash photos. To use your own:</p><ol><li>Put files in <code>public/brand/</code>, e.g. <code>public/brand/hero.jpg</code>.</li><li>Change the matching <code>src</code> in <code>media.ts</code> to <code>"/brand/hero.jpg"</code> and update the <code>alt</code> text.</li><li>For a CDN, add the domain to <code>images.remotePatterns</code> in <code>next.config.ts</code> and to <code>REMOTE_IMAGE_HOSTS</code> in <code>media.ts</code>.</li></ol><p>No component changes needed.</p>`,
product:`<p>Product photos are not in the codebase. Upload them from <b>Admin → Products → (product) → Images</b>.</p><p>Files must be JPG, PNG, WebP or AVIF, up to 5 MB, and are checked by magic bytes. They're stored under <code>UPLOAD_DIR</code> and served from <code>/uploads/…</code>. Until a product has a photo, the store shows a branded placeholder.</p><p>On a host without a persistent disk (like Vercel), switch <code>src/server/storage.ts</code> to S3, Cloudinary or R2 — see "Going to production" in <a href="docs/ARCHITECTURE.md#going-to-production">docs/ARCHITECTURE.md</a>.</p>`};
function drawI(k){$('#img').innerHTML=IM[k]}drawI('banner');
$$('[data-i]').forEach(b=>b.onclick=()=>{$$('[data-i]').forEach(x=>x.setAttribute('aria-selected',x===b));drawI(b.dataset.i)});

/* troubleshooting */
const H=[["Can't reach database server at localhost:5432","PostgreSQL isn't running. Start it (brew services start postgresql@16, or open Postgres.app) and check that DATABASE_URL in .env matches your user, password and database name."],
["Postgres won't start on macOS after a crash (stale postmaster.pid)","The log says lock file \"postmaster.pid\" already exists. First make sure no postgres process is running (ps aux | grep postgres), then remove the file and restart.\n\n# Homebrew (Apple Silicon)\nrm /opt/homebrew/var/postgresql@16/postmaster.pid\nbrew services restart postgresql@16\n\n# Homebrew (Intel):  /usr/local/var/postgresql@16/postmaster.pid\n# Postgres.app:      ~/Library/Application Support/Postgres/var-16/postmaster.pid"],
["Environment variable not found: DATABASE_URL / Prisma client errors","Make sure .env exists (copy .env.example), then run: npx prisma generate — also after pulling schema changes."],
["Re-seeding","npm run db:seed clears all existing rows before inserting, so it's safe to repeat on a development database. It also removes product images added through the admin (files stay in UPLOAD_DIR). Never run it against production."],
["brew services start fails with a Ruby error","Start PostgreSQL directly:\n\n/opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 -l /opt/homebrew/var/postgresql@16/server.log start"],
["Operation not permitted (project in Documents, Desktop or Downloads)","macOS privacy protection blocks apps without access to those folders. Allow your terminal or editor under System Settings → Privacy & Security → Files & Folders, or keep the project elsewhere, e.g. ~/pranav/lushaura."],
["Admin redirects back to /admin/login","You're signed in as a customer, or not at all. Log in with the admin credentials. Customer and admin sessions share one cookie, so signing in as one signs you out of the other."],
["Uploaded product images don't show","Check that UPLOAD_DIR exists and is writable, and that the server runs from the project root."]];
function drawH(){const q=$('#tq').value.toLowerCase();let n=0;
  $('#ts').innerHTML=H.map(h=>{const hide=q&&!(h[0]+h[1]).toLowerCase().includes(q);if(!hide)n++;
    const [first,...rest]=h[1].split('\n\n');
    return `<details ${hide?'hidden':''} ${q&&!hide?'open':''}><summary>${h[0]}</summary><p style="margin-top:0">${first}</p>${rest.length?cb(rest.join('\n\n')):''}</details>`}).join('');
  $('#tmsg').textContent=n?'':'Nothing matches. Check the Prisma and Postgres logs for the exact error text.'}
$('#tq').oninput=drawH;drawH();

/* scrollspy */
const links=$$('#nav a');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-30% 0px -60% 0px'});
$$('section').forEach(s=>io.observe(s));
</script>
</body>
</html>

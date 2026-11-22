// Gera o site estático em ../site  (uso:  npm run build)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { transform } from 'esbuild';
import sharp from 'sharp';
import * as solid from '@fortawesome/free-solid-svg-icons';
import * as brands from '@fortawesome/free-brands-svg-icons';
import { site as S } from './config.mjs';
import { categories, products } from './products.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../site');
const require = createRequire(import.meta.url);

fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, data) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
};
const hash = (b) => crypto.createHash('sha1').update(b).digest('hex').slice(0, 8);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const wa = (msg) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
const ldjson = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
const off = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

/* ------------------------------------------------------------------ ícones */
const pascal = (n) => n.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
function iconDef(n) {
  const k = 'fa' + pascal(n);
  const d = brands[k] || solid[k];
  if (!d) throw new Error('Ícone Font Awesome não encontrado: ' + n);
  const [w, h, , , p] = d.icon;
  return { w, h, p };
}
const ic = (n, c = '') => `<svg class="ic${c ? ' ' + c : ''}" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;

const logoRounded = `<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#19c39a"/><stop offset="1" stop-color="#0a7a5c"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg)"/><rect x="19" y="9" width="10" height="30" rx="3" fill="#fff"/><rect x="9" y="19" width="30" height="10" rx="3" fill="#fff"/><circle cx="38" cy="10" r="4" fill="#ffb020"/>`;
const logoFull = `<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#19c39a"/><stop offset="1" stop-color="#0a7a5c"/></linearGradient></defs><rect width="48" height="48" fill="url(#lg)"/><rect x="19" y="11" width="10" height="26" rx="3" fill="#fff"/><rect x="11" y="19" width="26" height="10" rx="3" fill="#fff"/>`;

function spriteFor(html) {
  const ids = [...new Set([...html.matchAll(/href="#i-([a-z0-9-]+)"/g)].map((m) => m[1]))];
  const sym = ids.map((id) => {
    if (id === 'logo') return `<symbol id="i-logo" viewBox="0 0 48 48">${logoRounded}</symbol>`;
    const { w, h, p } = iconDef(id);
    return `<symbol id="i-${id}" viewBox="0 0 ${w} ${h}"><path d="${p}"/></symbol>`;
  });
  return `<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">${sym.join('')}</svg>`;
}

/* ------------------------------------------------- ilustrações dos produtos */
const label = (x, y, w, h, c, d) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/><circle cx="${x + w / 2}" cy="${y + h * 0.3}" r="${Math.min(w, h) * 0.13}" fill="${c}"/><rect x="${x + w * 0.2}" y="${y + h * 0.58}" width="${w * 0.6}" height="8" rx="4" fill="${d}" opacity=".85"/><rect x="${x + w * 0.3}" y="${y + h * 0.58 + 16}" width="${w * 0.4}" height="6" rx="3" fill="${c}" opacity=".55"/>`;
const shine = (x, y, h) => `<rect x="${x}" y="${y}" width="12" height="${h}" rx="6" fill="#fff" opacity=".3"/>`;
const ridges = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="5" fill="#000" opacity=".1"/><rect x="${x}" y="${y + 16}" width="${w}" height="5" fill="#000" opacity=".1"/>`;
const shapes = {
  bottle: (c, d) => `<rect x="130" y="128" width="140" height="214" rx="30" fill="${c}"/><rect x="152" y="76" width="96" height="60" rx="14" fill="${d}"/>${ridges(152, 90, 96)}${label(130, 186, 140, 104, c, d)}${shine(146, 146, 170)}`,
  jar: (c, d) => `<rect x="112" y="116" width="176" height="56" rx="16" fill="${d}"/>${ridges(112, 128, 176)}<rect x="124" y="164" width="152" height="178" rx="30" fill="${c}"/>${label(124, 196, 152, 100, c, d)}${shine(138, 180, 150)}`,
  tube: (c, d) => `<rect x="164" y="316" width="72" height="34" rx="8" fill="${d}"/><path d="M142 64h116l-8 20-3 232h-94l-3-232z" fill="${c}"/><rect x="138" y="52" width="124" height="24" rx="5" fill="${d}"/><rect x="146" y="58" width="108" height="3" fill="#000" opacity=".12"/><rect x="146" y="66" width="108" height="3" fill="#000" opacity=".12"/>${label(152, 150, 96, 112, c, d)}`,
  pump: (c, d) => `<rect x="140" y="168" width="120" height="174" rx="28" fill="${c}"/><rect x="184" y="136" width="32" height="40" fill="${d}"/><rect x="160" y="110" width="84" height="32" rx="10" fill="${d}"/><rect x="224" y="118" width="46" height="12" rx="6" fill="${d}"/>${label(140, 214, 120, 100, c, d)}${shine(154, 186, 130)}`,
  box: (c, d) => `<defs><clipPath id="k"><rect x="100" y="116" width="200" height="226" rx="16"/></clipPath></defs><g clip-path="url(#k)"><rect x="100" y="116" width="200" height="226" fill="${c}"/><rect x="100" y="116" width="200" height="50" fill="${d}"/><rect x="100" y="306" width="200" height="36" fill="${d}"/></g>${label(116, 182, 168, 108, c, d)}`,
  pack: (c, d) => `<path d="M104 150q0-36 36-36h120q36 0 36 36v168q0 28-28 28H132q-28 0-28-28z" fill="${c}"/><path d="M104 150q0-36 36-36h120q36 0 36 36v14H104z" fill="${d}"/><ellipse cx="200" cy="246" rx="70" ry="62" fill="#fff"/><circle cx="200" cy="226" r="22" fill="${c}"/><rect x="164" y="264" width="72" height="8" rx="4" fill="${d}" opacity=".85"/><rect x="176" y="280" width="48" height="6" rx="3" fill="${c}" opacity=".55"/>${shine(120, 184, 130)}`,
  wipes: (c, d) => `<rect x="102" y="196" width="196" height="146" rx="26" fill="${c}"/><rect x="146" y="164" width="108" height="44" rx="16" fill="${d}"/><rect x="170" y="148" width="60" height="22" rx="8" fill="#fff" opacity=".9"/><ellipse cx="200" cy="272" rx="62" ry="40" fill="#fff"/><circle cx="200" cy="262" r="14" fill="${c}"/><rect x="170" y="286" width="60" height="7" rx="3.5" fill="${d}" opacity=".85"/>`,
  device: (c, d) => `<path d="M146 160c4-62 104-62 108 0" fill="none" stroke="${d}" stroke-width="16" stroke-linecap="round"/><rect x="104" y="150" width="192" height="192" rx="34" fill="${c}"/><rect x="132" y="178" width="136" height="76" rx="16" fill="#0f2b2e"/><rect x="150" y="194" width="26" height="8" rx="4" fill="#6ee7b7"/><rect x="150" y="212" width="100" height="22" rx="6" fill="#6ee7b7" opacity=".9"/><circle cx="200" cy="298" r="20" fill="${d}"/><circle cx="200" cy="298" r="9" fill="#fff" opacity=".85"/>`,
  thermo: (c, d) => `<g transform="rotate(-32 200 200)"><rect x="62" y="172" width="276" height="56" rx="28" fill="${c}"/><rect x="92" y="186" width="84" height="28" rx="9" fill="#0f2b2e"/><rect x="104" y="196" width="38" height="8" rx="4" fill="#6ee7b7"/><circle cx="214" cy="200" r="10" fill="#fff" opacity=".9"/><rect x="300" y="180" width="46" height="40" rx="20" fill="${d}"/></g>`,
};
const groundShadow = `<ellipse cx="200" cy="352" rx="112" ry="14" fill="#0f3d34" opacity=".12"/>`;
const productSvg = (p) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">${groundShadow}${shapes[p.type](p.c, p.d)}</svg>`;

const IMG = {};
for (const p of products) {
  const svg = productSvg(p);
  const rel = `assets/img/${p.slug}.${hash(svg)}.svg`;
  write(rel, svg);
  IMG[p.slug] = rel;
}
const prod = Object.fromEntries(products.map((p) => [p.slug, p]));

/* ------------------------------------------------------- CSS, JS e fonte */
const css = await transform(fs.readFileSync(path.join(here, 'src/style.css'), 'utf8'), { loader: 'css', minify: true });
const js = await transform(fs.readFileSync(path.join(here, 'src/app.js'), 'utf8'), { loader: 'js', minify: true, target: 'es2018' });
const CSS = `assets/style.${hash(css.code)}.css`;
const JS = `assets/app.${hash(js.code)}.js`;
write(CSS, css.code);
write(JS, js.code);
const fontSrc = path.dirname(require.resolve('@fontsource-variable/nunito/package.json'));
write('assets/fonts/nunito.woff2', fs.readFileSync(path.join(fontSrc, 'files/nunito-latin-wght-normal.woff2')));

/* ---------------------------------------------------------------- layout */
const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";
const PAGES = { index: 'index.html', produtos: 'produtos.html', contato: 'contato.html', privacidade: 'privacidade.html' };
const hello = `Olá! 👋 Vim pelo site da ${S.name} e gostaria de ajuda com um pedido.`;
const addr = `${S.address.street} – ${S.address.district}, ${S.address.city}/${S.address.state}`;

const navItem = (file, text, active) => `<a href="${file}"${active ? ' aria-current="page"' : ''}>${text}</a>`;

function header(active) {
  return `<a class="skip" href="#main">Pular para o conteúdo</a>
<div class="topbar"><div class="container"><span>${ic('truck-fast')} Frete grátis acima de R$ ${S.freeShippingFrom}</span><span>${ic('shield-halved')} Compra segura pelo WhatsApp</span><span>${ic('user-doctor')} Farmacêutico à sua disposição</span></div></div>
<header class="header"><div class="container hdr">
<a class="logo" href="index.html" aria-label="${esc(S.name)} – página inicial"><svg class="logo-mark" aria-hidden="true"><use href="#i-logo"/></svg><span>${esc(S.name.split(' ')[0])} <b>${esc(S.name.split(' ').slice(1).join(' '))}</b></span></a>
<nav class="nav" id="nav" aria-label="Principal">
${navItem('index.html', 'Início', active === 'index')}${navItem('produtos.html', 'Produtos', active === 'produtos')}${navItem('index.html#como-comprar', 'Como comprar', false)}${navItem('contato.html', 'Contato', active === 'contato')}
<form class="search" action="produtos.html" method="get" role="search"><label class="sr" for="hq">Buscar produtos</label><input id="hq" type="search" name="q" placeholder="Buscar produtos" maxlength="60" autocomplete="off"><button type="submit" aria-label="Buscar">${ic('magnifying-glass')}</button></form>
</nav>
<a class="btn btn-wa btn-sm hdr-wa" href="${wa(hello)}" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">${ic('whatsapp')}<span class="hide-sm">WhatsApp</span></a>
<button class="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu">${ic('bars', 'b')}${ic('xmark', 'x')}</button>
</div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container">
<div class="f-grid">
<div><a class="logo" href="index.html" aria-label="${esc(S.name)}"><svg class="logo-mark" aria-hidden="true"><use href="#i-logo"/></svg><span>${esc(S.name.split(' ')[0])} <b>${esc(S.name.split(' ').slice(1).join(' '))}</b></span></a>
<p class="f-about">Cuidado de verdade com você e sua família: atendimento humano, orientação farmacêutica e entrega rápida.</p>
<div class="social"><a class="wa" href="${wa(hello)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${ic('whatsapp')}</a><a href="${esc(S.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${ic('facebook-f')}</a><a href="${esc(S.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${ic('instagram')}</a></div></div>
<div><h2 class="f-title">Navegue</h2><div class="f-links"><a href="index.html">Início</a><a href="produtos.html">Produtos</a><a href="index.html#como-comprar">Como comprar</a><a href="contato.html">Contato</a><a href="privacidade.html">Política de privacidade</a></div></div>
<div><h2 class="f-title">Atendimento</h2><ul class="f-contact">
<li>${ic('whatsapp')}<a href="${wa(hello)}" target="_blank" rel="noopener noreferrer">${esc(S.phoneDisplay)} (WhatsApp)</a></li>
<li>${ic('envelope')}<a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>
<li>${ic('location-dot')}<span>${esc(addr)}</span></li>
<li>${ic('clock')}<span>${esc(S.hours[0].label)}: ${S.hours[0].opens.replace(':00', 'h')} às ${S.hours[0].closes.replace(':00', 'h')}</span></li>
</ul></div>
</div>
<div class="legal">
<p>${esc(S.legalName)} · CNPJ ${esc(S.cnpj)} · AFE/MS nº ${esc(S.afe)} · Farmacêutico(a) responsável: ${esc(S.pharmacist)} – ${esc(S.crf)}</p>
<p><strong>Medicamentos podem causar efeitos indesejados. Leia a bula e, persistindo os sintomas, o médico deverá ser consultado.</strong> Imagens ilustrativas. Preços e ofertas sujeitos a alteração e à disponibilidade de estoque.</p>
<p>© ${S.year} ${esc(S.name)}. Todos os direitos reservados. <span class="lock">${ic('lock')} Site protegido por HTTPS</span></p>
</div></div></footer>`;
}

function floatWa() {
  const url = wa(`Olá! 👋 Vim pelo site da ${S.name} e gostaria de ajuda para encontrar um produto.`);
  return `<div class="wa-float" id="waFloat">
<div class="wa-bubble"><a href="${url}" target="_blank" rel="noopener noreferrer"><span class="av">${ic('user-doctor')}</span><span class="txt"><strong>${esc(S.name)}</strong><span>Olá! 👋 Posso ajudar você a encontrar o produto ideal?</span></span></a><button class="wa-close" type="button" aria-label="Fechar mensagem">${ic('xmark')}</button></div>
<a class="wa-fab" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a ${esc(S.name)} no WhatsApp">${ic('whatsapp')}<span class="wa-badge" aria-hidden="true">1</span></a>
</div>`;
}

function page({ file, title, desc, body, ld = [], active, robots = 'index,follow,max-image-preview:large' }) {
  const url = `${S.domain}/${file === 'index.html' ? '' : file}`;
  const head = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta http-equiv="Content-Security-Policy" content="${CSP}"><meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="robots" content="${robots}"><meta name="theme-color" content="#0b8a68"><meta name="format-detection" content="telephone=no">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="${esc(S.name)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${S.domain}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(S.name)} – ${esc(S.tagline)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${S.domain}/og.png">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="icon" href="favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest">
<link rel="preload" href="assets/fonts/nunito.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${CSS}"><script defer src="${JS}"></script>
${ld.map(ldjson).join('')}
</head><body><!--SPRITE-->
${header(active)}
<main id="main">${body}</main>
${footer()}
${floatWa()}
</body></html>`;
  const html = head.replace('<!--SPRITE-->', '');
  const out = html.replace('<body>', '<body>' + spriteFor(html)).replace(/\s*\n\s*/g, ' ');
  write(file, out);
}

/* ------------------------------------------------------------ componentes */
function card(p, { rank } = {}) {
  const o = off(p);
  const cat = catById[p.cat];
  const url = wa(p.msg.replace('{preco}', brl(p.price)));
  const badge = p.best && rank ? `<span class="badge badge-best">${ic('star')} #${p.best} mais vendido</span>` : o ? `<span class="badge badge-off">-${o}%</span>` : '';
  const search = `${p.name} ${p.size} ${p.short} ${cat.name}`.toLowerCase();
  return `<article class="card t-${p.cat} reveal" id="${p.slug}" data-cat="${p.cat}" data-search="${esc(search)}">
${badge}<div class="card-img"><img src="${IMG[p.slug]}" width="400" height="400" loading="lazy" decoding="async" alt="${esc(p.name)} – ${esc(p.size)}"></div>
<div class="card-body"><span class="tag">${esc(cat.name)}</span><h3>${esc(p.name)}</h3><span class="size">${esc(p.size)}</span><p class="desc">${esc(p.short)}</p>
<div class="price-row"><span class="price">${brl(p.price)}</span>${p.old ? `<s class="old">${brl(p.old)}</s>` : ''}${o && badge.includes('best') ? `<span class="off">-${o}%</span>` : ''}</div>
<a class="btn btn-wa btn-block" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Comprar ${esc(p.name)} pelo WhatsApp">${ic('whatsapp')} Comprar</a>
<span class="note">Abre o WhatsApp com seu pedido pronto</span></div></article>`;
}

const artImgs = (a, b, c, first) =>
  `<div class="art" aria-hidden="true">${[['a', a], ['b', b], ['c', c]].map(([k, s]) => `<img class="${k}" src="${IMG[s]}" width="400" height="400" alt=""${first && k === 'b' ? ' fetchpriority="high"' : first ? '' : ' loading="lazy"'}${first && k !== 'b' ? ' loading="lazy"' : ''} decoding="async">`).join('')}</div>`;

const best = products.filter((p) => p.best).sort((a, b) => a.best - b.best);
const maxVitOff = Math.max(...products.filter((p) => p.cat === 'vitaminas').map(off));

const faq = [
  ['Como faço para comprar?', 'É simples: escolha o produto no site e clique em “Comprar”. O WhatsApp abre com a mensagem pronta, é só enviar. Nossa equipe confirma a disponibilidade, o valor e combina a entrega com você.'],
  ['Vocês entregam no meu endereço?', `Sim! Informe seu endereço no WhatsApp e confirmamos o prazo e a taxa. Pedidos acima de R$ ${S.freeShippingFrom} têm frete grátis.`],
  ['Quais são as formas de pagamento?', 'Aceitamos Pix, cartões de crédito e débito e dinheiro na entrega. Combinamos tudo com você pelo WhatsApp, com total segurança.'],
  ['Preciso de receita para comprar?', 'Medicamentos isentos de prescrição podem ser comprados direto. Para os que exigem receita, envie uma foto legível da receita pelo WhatsApp e nosso farmacêutico faz a conferência.'],
  ['O site é seguro? Vocês pedem dados do cartão?', 'O site usa conexão segura (HTTPS) e não pede dados de cartão. Todo o pagamento é combinado diretamente com nossa equipe, pelo WhatsApp.'],
];

/* ============================================================== INDEX */
{
  const slide = (n, cls, inner, art) => `<article class="slide ${cls}" role="group" aria-roledescription="slide" aria-label="${n} de 3"><div>${inner}</div>${art}</article>`;
  const s1 = slide(1, 's1', `<span class="pill">${ic('user-doctor')} Atendimento farmacêutico</span>
<h1 class="hl">Sua <em>farmácia de confiança</em> a um clique de distância</h1>
<p class="lead">Escolha seus produtos e finalize pelo WhatsApp. Atendimento humano, entrega rápida e orientação de um farmacêutico de verdade.</p>
<div class="btns"><a class="btn btn-wa btn-lg" href="${wa(hello)}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Fazer meu pedido</a><a class="btn btn-ghost btn-lg" href="produtos.html">Ver produtos</a></div>
<ul class="checks"><li>${ic('circle-check')} Sem cadastro</li><li>${ic('circle-check')} Resposta rápida</li><li>${ic('circle-check')} Entrega em casa</li></ul>`,
    artImgs('vitamina-c-1000', 'multivitaminico-a-z', 'omega-3-1000', true));
  const s2 = slide(2, 's2', `<span class="pill">${ic('tags')} Ofertas da semana</span>
<h2 class="hl">Vitaminas e suplementos com até <em>${maxVitOff}% OFF</em></h2>
<p class="lead">Reforce a sua rotina de bem-estar com preços especiais. Ofertas válidas enquanto durarem os estoques.</p>
<div class="btns"><a class="btn btn-brand btn-lg" href="produtos.html#vitaminas">Ver ofertas ${ic('arrow-right')}</a><a class="btn btn-ghost btn-lg" href="${wa('Olá! 😊 Vi as ofertas de vitaminas no site e gostaria de saber quais estão disponíveis hoje.')}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Perguntar no WhatsApp</a></div>`,
    artImgs('colageno-hidrolisado', 'vitamina-d3-2000', 'omega-3-1000', false));
  const s3 = slide(3, 's3', `<span class="pill">${ic('sun')} Cuidado com a pele</span>
<h2 class="hl">Proteção solar e dermocosméticos para <em>toda a família</em></h2>
<p class="lead">Pele protegida e hidratada o ano inteiro. Conte com a indicação de um farmacêutico para escolher o produto ideal.</p>
<div class="btns"><a class="btn btn-brand btn-lg" href="produtos.html#dermo">Ver cuidados com a pele ${ic('arrow-right')}</a><a class="btn btn-ghost btn-lg" href="${wa('Olá! Gostaria de uma indicação de protetor solar e hidratante para o meu tipo de pele.')}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Pedir indicação</a></div>`,
    artImgs('hidratante-facial', 'protetor-solar-fps50', 'protetor-labial-fps30', false));

  const body = `
<section class="hero" aria-label="Destaques"><div class="container hero-wrap" role="region" aria-roledescription="carousel" aria-label="Destaques da farmácia">
<div class="vp"><div class="slides" id="slides">${s1}${s2}${s3}</div>
<button class="arrow prev" type="button" aria-label="Banner anterior">${ic('chevron-left')}</button><button class="arrow next" type="button" aria-label="Próximo banner">${ic('chevron-right')}</button></div>
<div class="dots" role="group" aria-label="Escolher banner"><button class="dot" type="button" aria-label="Banner 1" aria-current="true"></button><button class="dot" type="button" aria-label="Banner 2" aria-current="false"></button><button class="dot" type="button" aria-label="Banner 3" aria-current="false"></button></div>
</div></section>

<section class="sec-tight"><div class="container"><ul class="trust">
<li><span class="ico">${ic('truck-fast')}</span><div><strong>Entrega rápida</strong><span>Receba em casa com agilidade</span></div></li>
<li><span class="ico">${ic('user-doctor')}</span><div><strong>Farmacêutico responsável</strong><span>Orientação profissional</span></div></li>
<li><span class="ico">${ic('shield-halved')}</span><div><strong>Compra segura</strong><span>Site protegido com HTTPS</span></div></li>
<li><span class="ico">${ic('hand-holding-heart')}</span><div><strong>Atendimento humano</strong><span>Do primeiro “oi” à entrega</span></div></li>
</ul></div></section>

<section class="sec"><div class="container">
<div class="sec-head"><div><span class="eyebrow">Categorias</span><h2 class="sec-h">Encontre o que você precisa</h2><p class="sec-p">Tudo o que sua família precisa para cuidar da saúde, em um só lugar.</p></div></div>
<div class="cats">${categories.map((c) => `<a class="cat reveal" href="produtos.html#${c.id}"><span class="ico">${ic(c.icon)}</span>${esc(c.name)}<small>${products.filter((p) => p.cat === c.id).length} produtos</small></a>`).join('')}</div>
</div></section>

<section class="sec pt0" id="mais-vendidos"><div class="container">
<div class="sec-head"><div><span class="eyebrow">Favoritos dos clientes</span><h2 class="sec-h">Os mais vendidos</h2><p class="sec-p">Os produtos que mais saem da nossa prateleira. Clique em comprar e o pedido já vai pronto no WhatsApp.</p></div></div>
<div class="grid g3">${best.map((p) => card(p, { rank: true })).join('')}</div>
<div class="more"><a class="btn btn-brand btn-lg" href="produtos.html">Ver mais produtos ${ic('arrow-right')}</a></div>
</div></section>

<section class="sec-tight"><div class="container"><div class="band reveal">
<div><h2>Ficou com dúvida? Pergunte a um farmacêutico.</h2><p>Tire dúvidas sobre produtos e modo de uso. É grátis e sem compromisso: a gente ajuda você a escolher com segurança.</p></div>
<a class="btn btn-white btn-lg" href="${wa('Olá! Tenho uma dúvida e gostaria de falar com um farmacêutico.')}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Conversar agora</a>
</div></div></section>

<section class="sec defer" id="como-comprar"><div class="container">
<div class="sec-head"><div><span class="eyebrow">Passo a passo</span><h2 class="sec-h">Comprar é simples e rápido</h2><p class="sec-p">Em três passos você garante seus produtos, sem filas e sem sair de casa.</p></div></div>
<ol class="steps">
<li class="step reveal"><div class="num">1</div><h3>Escolha o produto</h3><p>Navegue pelas categorias ou use a busca para encontrar o que precisa.</p></li>
<li class="step reveal"><div class="num">2</div><h3>Clique em “Comprar”</h3><p>O WhatsApp abre com a mensagem já escrita. É só tocar em enviar.</p></li>
<li class="step reveal"><div class="num">3</div><h3>Confirme e receba</h3><p>Nossa equipe confirma o estoque, combina o pagamento e a entrega com você.</p></li>
</ol></div></section>

<section class="sec defer pt0"><div class="container">
<div class="sec-head"><div><span class="eyebrow">Dúvidas frequentes</span><h2 class="sec-h">Perguntas e respostas</h2></div></div>
<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>

<section class="sec-tight defer"><div class="container"><div class="cta reveal">
<h2>Pronto para cuidar de você?</h2>
<p>Fale com a gente agora e receba atendimento rápido, de pessoas que se importam com a sua saúde.</p>
<div class="btns"><a class="btn btn-wa btn-lg" href="${wa(hello)}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Chamar no WhatsApp</a><a class="btn btn-ghost btn-lg" href="${esc(S.googleReviews)}" target="_blank" rel="noopener noreferrer">${ic('star')} Ver avaliações no Google</a></div>
</div></div></section>`;

  page({
    file: 'index.html', active: 'index', body,
    title: `${S.name} | Farmácia com entrega rápida e atendimento pelo WhatsApp`,
    desc: `Farmácia online em ${S.address.city}: vitaminas, dermocosméticos, higiene e bebê. Escolha no site e compre pelo WhatsApp com orientação de um farmacêutico e entrega rápida.`,
    ld: [
      {
        '@context': 'https://schema.org', '@type': 'Pharmacy', name: S.name, url: S.domain + '/', image: `${S.domain}/og.png`, logo: `${S.domain}/apple-touch-icon.png`,
        telephone: S.phoneTel, email: S.email, priceRange: '$$',
        address: { '@type': 'PostalAddress', streetAddress: S.address.street, addressLocality: S.address.city, addressRegion: S.address.state, postalCode: S.address.zip, addressCountry: 'BR' },
        openingHoursSpecification: S.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
        sameAs: [S.facebook, S.instagram],
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: S.name, url: S.domain + '/', inLanguage: 'pt-BR', potentialAction: { '@type': 'SearchAction', target: `${S.domain}/produtos.html?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  });
}

/* ============================================================ PRODUTOS */
{
  const body = `
<section class="page-hero"><div class="container">
<nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a> › Produtos</nav>
<h1 class="hl hl-page">Nossos produtos</h1>
<p class="sec-p mt-s">Encontre vitaminas, cuidados com a pele, higiene, produtos para o bebê e muito mais. Clique em <strong>Comprar</strong> e o pedido vai pronto para o nosso WhatsApp.</p>
</div></section>
<section class="sec pt0"><div class="container">
<div class="toolbar">
<div class="searchbox">${ic('magnifying-glass')}<label class="sr" for="q">Buscar produto</label><input id="q" type="search" placeholder="Buscar produto: vitamina, protetor solar, fralda…" maxlength="60" autocomplete="off"></div>
<div class="chips" role="group" aria-label="Filtrar por categoria"><button class="chip" type="button" data-cat="todos" aria-pressed="true">Todos <small>${products.length}</small></button>${categories.map((c) => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="false">${esc(c.name)} <small>${products.filter((p) => p.cat === c.id).length}</small></button>`).join('')}</div>
</div>
<p class="results" id="count" aria-live="polite">Mostrando ${products.length} produtos</p>
<h2 class="sr">Lista de produtos</h2>
<div class="grid" id="grid">${products.map((p) => card(p)).join('')}</div>
<div class="empty" id="empty" hidden><h3>Não encontramos esse produto por aqui</h3><p>Mas podemos conseguir para você! Pergunte no WhatsApp e consultamos o estoque.</p><a class="btn btn-wa btn-lg" id="emptyWa" data-wa="${S.whatsapp}" href="${wa('Olá! Procurei um produto no site e não encontrei. Podem me ajudar?')}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Perguntar no WhatsApp</a></div>
<p class="legal-note">${ic('circle-info')}<span>Medicamentos podem causar efeitos indesejados. Leia a bula e, persistindo os sintomas, o médico deverá ser consultado. Suplementos não substituem uma alimentação equilibrada. Imagens ilustrativas; preços e disponibilidade sujeitos a alteração.</span></p>
</div></section>
<section class="sec-tight"><div class="container"><div class="band reveal">
<div><h2>Não achou o que procura?</h2><p>Consultamos o estoque e buscamos para você. Mande o nome do produto e nós respondemos.</p></div>
<a class="btn btn-white btn-lg" href="${wa('Olá! Não encontrei um produto no site. Podem verificar se vocês têm?')}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Falar com a equipe</a>
</div></div></section>`;
  page({
    file: 'produtos.html', active: 'produtos', body,
    title: `Produtos: vitaminas, dermocosméticos, higiene e bebê | ${S.name}`,
    desc: `Veja o catálogo da ${S.name}: vitaminas e suplementos, proteção solar, higiene, bebê e saúde em casa. Compre pelo WhatsApp com entrega rápida.`,
    ld: [
      { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'Product', name: p.name, description: `${p.short} ${p.size}.`, image: `${S.domain}/${IMG[p.slug]}`, category: catById[p.cat].name,
          offers: { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: `${S.domain}/produtos.html#${p.slug}`, seller: { '@type': 'Organization', name: S.name } },
        },
      })) },
    ],
  });
}

/* ============================================================ CONTATO */
{
  const rows = S.hours.map((h) => `<tr><th scope="row">${esc(h.label)}</th><td>${h.opens.replace(':00', 'h')} às ${h.closes.replace(':00', 'h')}</td></tr>`).join('');
  const body = `
<section class="page-hero"><div class="container">
<nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a> › Contato</nav>
<h1 class="hl hl-page">Fale com a gente</h1>
<p class="sec-p mt-s">Estamos prontos para ajudar. O jeito mais rápido é pelo WhatsApp, mas você também pode nos visitar ou ligar.</p>
</div></section>
<section class="sec pt0"><div class="container contact">
<div>
<a class="info wa" href="${wa(hello)}" target="_blank" rel="noopener noreferrer"><span class="ico">${ic('whatsapp')}</span><div><strong>WhatsApp · resposta rápida</strong><span>${esc(S.phoneDisplay)} – clique para conversar</span></div></a>
<a class="info" href="tel:${esc(S.phoneTel)}"><span class="ico">${ic('phone')}</span><div><strong>Telefone</strong><span>${esc(S.phoneDisplay)}</span></div></a>
<a class="info" href="mailto:${esc(S.email)}"><span class="ico">${ic('envelope')}</span><div><strong>E-mail</strong><span>${esc(S.email)}</span></div></a>
<a class="info" href="${esc(S.mapsUrl)}" target="_blank" rel="noopener noreferrer"><span class="ico">${ic('location-dot')}</span><div><strong>Venha nos visitar</strong><span>${esc(addr)} · CEP ${esc(S.address.zip)}</span></div></a>
<div class="info block"><div class="info-h"><span class="ico">${ic('clock')}</span><strong>Horário de atendimento</strong></div><table class="hours"><tbody>${rows}</tbody></table></div>
</div>
<form class="form" id="contactForm" data-wa="${S.whatsapp}">
<h2>Envie sua mensagem</h2><p>Preencha e continue a conversa no WhatsApp com a nossa equipe.</p>
<label for="nome">Seu nome</label><input id="nome" name="nome" type="text" required maxlength="80" autocomplete="name" placeholder="Como podemos te chamar?">
<label for="assunto">Assunto</label><select id="assunto" name="assunto"><option>Quero comprar um produto</option><option>Dúvida sobre um produto</option><option>Entrega e prazos</option><option>Falar com o farmacêutico</option><option>Outro assunto</option></select>
<label for="mensagem">Mensagem</label><textarea id="mensagem" name="mensagem" required maxlength="600" placeholder="Conte como podemos ajudar…"></textarea>
<button class="btn btn-wa btn-lg btn-block" type="submit">${ic('whatsapp')} Enviar pelo WhatsApp</button>
<p class="secure">${ic('lock')} Seus dados não ficam salvos neste site</p>
</form>
</div></section>`;
  page({
    file: 'contato.html', active: 'contato', body,
    title: `Contato e localização | ${S.name}`,
    desc: `Fale com a ${S.name} pelo WhatsApp, telefone ou e-mail. Veja endereço e horário de atendimento em ${S.address.city}/${S.address.state}.`,
    ld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: `Contato – ${S.name}`, url: `${S.domain}/contato.html`, mainEntity: { '@type': 'Pharmacy', name: S.name, telephone: S.phoneTel, email: S.email, address: { '@type': 'PostalAddress', streetAddress: S.address.street, addressLocality: S.address.city, addressRegion: S.address.state, postalCode: S.address.zip, addressCountry: 'BR' } } }],
  });
}

/* ========================================================== PRIVACIDADE */
page({
  file: 'privacidade.html', active: '',
  title: `Política de privacidade | ${S.name}`,
  desc: `Saiba como a ${S.name} trata seus dados pessoais, em conformidade com a LGPD.`,
  body: `<section class="page-hero"><div class="container prose">
<nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a> › Política de privacidade</nav>
<h1 class="hl hl-page">Política de privacidade</h1>
<p class="sec-p mt-s">Última atualização: ${S.year}. Aqui explicamos, de forma simples, como cuidamos dos seus dados (Lei nº 13.709/2018 – LGPD).</p>
<h2>1. O que coletamos</h2><p>Este site não possui cadastro, login nem loja com pagamento, e não armazena dados pessoais em servidores próprios. Ao clicar em “Comprar” ou usar o formulário de contato, você é direcionado ao WhatsApp com uma mensagem pré-escrita. A partir daí, os dados que você enviar (nome, endereço, pedido) são tratados na conversa.</p>
<h2>2. Para que usamos</h2><p>Usamos as informações enviadas pelo WhatsApp apenas para atender seu pedido, tirar dúvidas, combinar pagamento e entrega e cumprir obrigações legais da atividade farmacêutica.</p>
<h2>3. Cookies e rastreadores</h2><p>Este site não utiliza cookies de publicidade nem ferramentas de rastreamento de terceiros.</p>
<h2>4. Compartilhamento</h2><p>Não vendemos nem compartilhamos seus dados. O WhatsApp (Meta) possui política própria, que se aplica à conversa realizada na plataforma.</p>
<h2>5. Seus direitos</h2><p>Você pode solicitar acesso, correção ou exclusão dos dados que tenha nos enviado, a qualquer momento, pelo e-mail ${esc(S.email)} ou pelo WhatsApp.</p>
<h2>6. Segurança</h2><p>O site é entregue por conexão criptografada (HTTPS) e adota cabeçalhos de segurança modernos para proteger você contra interceptação e ataques comuns na web.</p>
<h2>7. Controlador</h2><p>${esc(S.legalName)} · CNPJ ${esc(S.cnpj)} · ${esc(addr)}.</p>
</div></section>`,
});

/* ================================================================== 404 */
page({
  file: '404.html', active: '', robots: 'noindex,follow',
  title: `Página não encontrada | ${S.name}`, desc: 'A página que você procura não foi encontrada.',
  body: `<section class="container err"><div><div class="big">404</div><h1 class="sec-h">Ops! Não achamos essa página</h1><p class="sec-p center">Mas podemos ajudar você a encontrar o que precisa.</p>
<div class="btns jc"><a class="btn btn-brand btn-lg" href="index.html">Voltar ao início</a><a class="btn btn-wa btn-lg" href="${wa(hello)}" target="_blank" rel="noopener noreferrer">${ic('whatsapp')} Falar no WhatsApp</a></div></div></section>`,
});

/* ===================================================== ícones e imagens */
write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${logoRounded}</svg>`);
const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="512" height="512">${logoFull}</svg>`;
const roundSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="512" height="512">${logoRounded}</svg>`;
write('apple-touch-icon.png', await sharp(Buffer.from(fullSvg)).resize(180, 180).png({ compressionLevel: 9 }).toBuffer());
write('icon-192.png', await sharp(Buffer.from(fullSvg)).resize(192, 192).png({ compressionLevel: 9 }).toBuffer());
write('icon-512.png', await sharp(Buffer.from(fullSvg)).resize(512, 512).png({ compressionLevel: 9 }).toBuffer());
{
  const png = await sharp(Buffer.from(roundSvg)).resize(32, 32).png().toBuffer();
  const h = Buffer.alloc(22);
  h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
  h[6] = 32; h[7] = 32; h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12); h.writeUInt32LE(png.length, 14); h.writeUInt32LE(22, 18);
  write('favicon.ico', Buffer.concat([h, png]));
}
{
  const g = (slug, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${groundShadow}${shapes[prod[slug].type](prod[slug].c, prod[slug].d)}</g>`;
  const [n1, ...n2] = S.name.split(' ');
  const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eafaf4"/><stop offset="1" stop-color="#ffffff"/></linearGradient><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#19c39a"/><stop offset="1" stop-color="#0a7a5c"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#bg)"/><circle cx="1010" cy="150" r="260" fill="#c6f0e1" opacity=".7"/><circle cx="120" cy="640" r="220" fill="#d9f5ea" opacity=".8"/>
<g transform="translate(80 120) scale(2.1)"><rect width="48" height="48" rx="14" fill="url(#lg)"/><rect x="19" y="9" width="10" height="30" rx="3" fill="#fff"/><rect x="9" y="19" width="30" height="10" rx="3" fill="#fff"/><circle cx="38" cy="10" r="4" fill="#ffb020"/></g>
<text x="80" y="330" font-family="Nunito,Arial,Helvetica,sans-serif" font-size="84" font-weight="800" fill="#14282b">${esc(n1)} <tspan fill="#0b8a68">${esc(n2.join(' '))}</tspan></text>
<text x="80" y="400" font-family="Nunito,Arial,Helvetica,sans-serif" font-size="40" font-weight="700" fill="#566b70">${esc(S.tagline)}</text>
<rect x="80" y="450" width="470" height="64" rx="32" fill="#0f8f4f"/><text x="315" y="493" text-anchor="middle" font-family="Nunito,Arial,Helvetica,sans-serif" font-size="28" font-weight="800" fill="#fff">Compre pelo WhatsApp</text>
${g('protetor-solar-fps50', 600, 215, 0.62)}${g('colageno-hidrolisado', 930, 230, 0.6)}${g('vitamina-c-1000', 720, 110, 0.82)}</svg>`;
  write('og.png', await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer());
}

/* ================================================== SEO, segurança, deploy */
write('manifest.webmanifest', JSON.stringify({
  name: S.name, short_name: S.name, description: S.tagline, lang: 'pt-BR', start_url: '/', scope: '/', display: 'standalone',
  background_color: '#ffffff', theme_color: '#0b8a68',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
}));
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${S.domain}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[['', '1.0'], ['produtos.html', '0.9'], ['contato.html', '0.6'], ['privacidade.html', '0.2']].map(([u, p]) => `<url><loc>${S.domain}/${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`);
write('.well-known/security.txt', `Contact: mailto:${S.email}\nExpires: ${new Date(Date.now() + 365 * 864e5).toISOString()}\nPreferred-Languages: pt, en\nCanonical: ${S.domain}/.well-known/security.txt\n`);

const CSP_HDR = CSP + "; frame-ancestors 'none'; upgrade-insecure-requests";
const PERMS = 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), interest-cohort=()';
write('_headers', `# Netlify / Cloudflare Pages
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: ${CSP_HDR}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: ${PERMS}
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  X-Permitted-Cross-Domain-Policies: none

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);
write('.htaccess', `# Apache / LiteSpeed (Hostinger, Locaweb, HostGator, cPanel...)
Options -Indexes
ServerSignature Off
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On
# Força HTTPS (protege contra interceptação / "man in the middle")
RewriteCond %{HTTPS} !=on
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
# Bloqueia arquivos ocultos (exceto /.well-known)
RewriteRule "(^|/)\\.(?!well-known)" - [F]
</IfModule>

<IfModule mod_headers.c>
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Content-Security-Policy "${CSP_HDR}"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "${PERMS}"
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Resource-Policy "same-origin"
Header always set X-Permitted-Cross-Domain-Policies "none"
Header unset X-Powered-By
<FilesMatch "\\.html$">
  Header set Cache-Control "no-cache"
</FilesMatch>
<If "%{REQUEST_URI} =~ m#^/assets/#">
  Header set Cache-Control "public, max-age=31536000, immutable"
</If>
</IfModule>

<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json application/manifest+json application/xml text/plain
</IfModule>

<IfModule mod_mime.c>
AddType application/manifest+json .webmanifest
AddType font/woff2 .woff2
</IfModule>
`);

console.log('OK  →', OUT);

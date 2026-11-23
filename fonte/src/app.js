/* Farma Vida – JS leve, sem dependências. Tudo é melhoria progressiva:
   o site funciona (e é indexável) mesmo se este arquivo não carregar. */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- Menu mobile ---------- */
  var burger = $('.burger'), nav = $('#nav');
  if (burger && nav) {
    var setNav = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    burger.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    d.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) setNav(false);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  }

  /* ---------- Carrossel de banners ---------- */
  var track = $('#slides');
  if (track) {
    var slides = $$('.slide', track), dots = $$('.dot'), idx = 0, timer = null;
    var show = function (n) {
      idx = (n + slides.length) % slides.length;
      track.scrollTo({ left: idx * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    };
    var mark = function () {
      var i = Math.round(track.scrollLeft / (track.clientWidth || 1));
      idx = Math.max(0, Math.min(slides.length - 1, i));
      dots.forEach(function (b, k) { b.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
    };
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { mark(); ticking = false; });
    }, { passive: true });
    dots.forEach(function (b, k) { b.addEventListener('click', function () { show(k); restart(); }); });
    var prev = $('.arrow.prev'), next = $('.arrow.next');
    if (prev) prev.addEventListener('click', function () { show(idx - 1); restart(); });
    if (next) next.addEventListener('click', function () { show(idx + 1); restart(); });

    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var start = function () { if (reduce || timer || d.hidden) return; timer = setInterval(function () { show(idx + 1); }, 6500); };
    var restart = function () { stop(); start(); };
    var wrap = $('.hero-wrap');
    if (wrap) {
      ['pointerenter', 'focusin', 'touchstart'].forEach(function (ev) { wrap.addEventListener(ev, stop, { passive: true }); });
      ['pointerleave', 'focusout'].forEach(function (ev) { wrap.addEventListener(ev, start); });
      wrap.addEventListener('touchend', function () { setTimeout(start, 4000); }, { passive: true });
    }
    d.addEventListener('visibilitychange', function () { d.hidden ? stop() : start(); });
    window.addEventListener('resize', function () { track.scrollTo({ left: idx * track.clientWidth }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { threshold: .25 }).observe(track);
    } else { start(); }
    mark();
  }

  /* ---------- Busca e filtro de produtos ---------- */
  var grid = $('#grid');
  if (grid) {
    var cards = $$('.card', grid), chips = $$('.chip'), input = $('#q'), count = $('#count'), empty = $('#empty');
    var emptyLink = $('#emptyWa'), state = { cat: 'todos', q: '' };
    var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); };
    var apply = function () {
      var n = 0, q = norm(state.q);
      cards.forEach(function (c) {
        var ok = (state.cat === 'todos' || c.getAttribute('data-cat') === state.cat) &&
          (!q || norm(c.getAttribute('data-search')).indexOf(q) > -1);
        c.hidden = !ok; if (ok) n++;
      });
      chips.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === state.cat ? 'true' : 'false'); });
      if (count) count.textContent = n === 1 ? 'Mostrando 1 produto' : 'Mostrando ' + n + ' produtos';
      if (empty) {
        empty.hidden = n !== 0;
        if (n === 0 && emptyLink) {
          var t = state.q ? 'Olá! Procurei por "' + state.q.slice(0, 60) + '" no site e não encontrei. Vocês têm ou conseguem para mim?' :
            'Olá! Procurei um produto no site e não encontrei. Podem me ajudar?';
          emptyLink.href = 'https://wa.me/' + emptyLink.getAttribute('data-wa') + '?text=' + encodeURIComponent(t);
        }
      }
    };
    var fromHash = function () {
      var h = decodeURIComponent((location.hash || '').slice(1));
      var ok = chips.some(function (b) { return b.getAttribute('data-cat') === h; });
      state.cat = ok ? h : 'todos';
    };
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        state.cat = b.getAttribute('data-cat');
        try { history.replaceState(null, '', state.cat === 'todos' ? location.pathname + location.search : '#' + state.cat); } catch (e) {}
        apply();
      });
    });
    if (input) input.addEventListener('input', function () { state.q = input.value; apply(); });
    window.addEventListener('hashchange', function () { fromHash(); apply(); });
    try {
      var p = new URLSearchParams(location.search).get('q');
      if (p) { state.q = p.slice(0, 60); if (input) input.value = state.q; }
    } catch (e) {}
    fromHash(); apply();
  }

  /* ---------- Formulário de contato -> WhatsApp ---------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form), g = function (k, n) { return String(f.get(k) || '').trim().slice(0, n); };
      var nome = g('nome', 80), assunto = g('assunto', 60), msg = g('mensagem', 600);
      if (!nome || !msg) return;
      var text = 'Olá! Meu nome é ' + nome + '.\nAssunto: ' + assunto + '\n\n' + msg;
      var url = 'https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent(text);
      var w = window.open(url, '_blank', 'noopener,noreferrer');
      if (!w) location.href = url;
    });
  }

  /* ---------- Balão do WhatsApp ---------- */
  var float = $('#waFloat');
  if (float) {
    var key = 'wa-closed';
    try { if (sessionStorage.getItem(key)) float.classList.add('closed'); } catch (e) {}
    /* o balão aparece aos 6s (CSS) e some 30s depois */
    setTimeout(function () { float.classList.add('gone'); }, reduce ? 30000 : 36000);
    var close = $('.wa-close', float);
    if (close) close.addEventListener('click', function () {
      float.classList.add('closed');
      try { sessionStorage.setItem(key, '1'); } catch (e) {}
    });
  }
})();

(() => {
  const root = document.documentElement;
  const isStatic = location.search.includes('static');
  if (isStatic) { root.classList.add('static'); document.querySelectorAll('img[loading=lazy],iframe[loading=lazy]').forEach(i => i.loading = 'eager'); }

  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const hero = document.querySelector('.hero-shrink, .media-hero');
  const mbar = document.querySelector('.mbar');
  const forms = [...document.querySelectorAll('.contact')];

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  // warm the italic face used by the nav hover swap so the first hover never shows blank glyphs
  if (document.fonts) document.fonts.load('italic 400 19px "Cormorant Garamond"');
  const closeMenu = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };

  const shrink = document.querySelector('.hero-shrink');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const forcedP = new URLSearchParams(location.search).get('p');
  function onScroll() {
    let p = 0;
    if (shrink && !isStatic && !reduce) {
      const r = shrink.getBoundingClientRect();
      const span = shrink.offsetHeight - innerHeight;
      p = Math.min(1, Math.max(0, -r.top / span));
      p = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    }
    if (forcedP !== null) p = parseFloat(forcedP);
    root.style.setProperty('--p', p.toFixed(4));
    const heroEnd = hero ? hero.getBoundingClientRect().bottom : 0;
    nav.classList.toggle('solid', heroEnd < 80 || p > .3);
    const inForm = forms.some(f => { const r = f.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
    mbar.classList.toggle('show', heroEnd < innerHeight * .5 && !inForm);
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Mobile hero: crossfade through the photos
  const figs = [...document.querySelectorAll('.collage figure')];
  const dots = [...document.querySelectorAll('.hero-dots i')];
  if (figs.length) {
    let i = 0;
    const show = n => { figs.forEach((f, k) => f.classList.toggle('on', k === n)); dots.forEach((d, k) => d.classList.toggle('on', k === n)); };
    show(0);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !isStatic) setInterval(() => { i = (i + 1) % figs.length; show(i); }, 4500);
  }

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Screen-change navigation ----------
  const curtain = document.querySelector('.curtain');
  const isHome = !!shrink;
  const LABELS = {
    top: ['01', 'Inicio'], acerca: ['02', 'Acerca de mí'], conferencias: ['03', 'Conferencias'], tedx: ['03', 'TEDx'],
    media: ['04', 'Media / Press'], videos: ['04', 'Entrevistas'], prensa: ['04', 'Prensa'], contacto: ['05', 'Contacto']
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const T_IN = reduce ? 240 : 980, T_OUT = reduce ? 260 : 900;
  if (reduce) curtain.classList.add('rm');
  let busy = false;

  function setCurtain(id) {
    const [n, t] = LABELS[id] || LABELS.top;
    curtain.querySelector('.c-num').textContent = n;
    curtain.querySelector('.c-title span').textContent = t;
  }
  function targetY(id) {
    if (id === 'top' || id === 'media') return 0;
    const el = document.getElementById(id);
    return el ? Math.round(el.getBoundingClientRect().top + scrollY) : 0;
  }
  function jump(id) {
    scrollTo({ top: targetY(id), left: 0, behavior: 'instant' });
    onScroll(); updateActive();
  }
  // staggered content entry for the section we land on
  function enter(id) {
    let items = [];
    if ((id === 'top' && isHome)) {
      const m = document.querySelector('.hero-shrink .hero-media');
      if (m && !reduce) { m.classList.remove('hero-in'); void m.offsetWidth; m.classList.add('hero-in'); }
    } else {
      const sec = id === 'media' || id === 'top' ? document.querySelector('.media-hero') : document.getElementById(id);
      if (!sec) return;
      items = [...sec.querySelectorAll('.eyebrow, h1, h2, .sec-intro, .lead, p, .reveal, .tcard, .cform, .yt-facade, .press-card, figure')]
        .filter(el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && !el.parentElement.closest('.st'); })
        .filter((el, i, arr) => !arr.some(o => o !== el && o.contains(el)))
        .slice(0, 9);
    }
    items.forEach(el => { el.classList.add('st', 'in'); el.classList.remove('st-in'); });
    void document.body.offsetWidth;
    items.forEach((el, i) => {
      el.style.transitionDelay = (reduce ? 0 : 140 + i * 85) + 'ms';
      el.classList.add('st-in');
      setTimeout(() => { el.classList.remove('st', 'st-in'); el.style.transitionDelay = ''; }, 1300 + i * 85);
    });
  }
  async function reveal() {
    curtain.classList.remove('is-in'); root.classList.remove('curtain-cover');
    curtain.classList.add('is-out');
    await wait(T_OUT);
    curtain.classList.remove('is-out');
  }
  async function cover(id) {
    setCurtain(id);
    curtain.classList.remove('is-out'); void curtain.offsetWidth;
    curtain.classList.add('is-in');
    await wait(T_IN);
  }
  async function go(id, hash) {
    if (busy) return; busy = true;
    closeMenu();
    await cover(id);
    jump(id);
    history.replaceState(null, '', hash ? '#' + hash : location.pathname);
    setTimeout(() => enter(id), reduce ? 0 : 120);
    await reveal();
    busy = false;
  }
  async function leave(href, id) {
    if (busy) return; busy = true;
    closeMenu();
    await cover(id);
    try { sessionStorage.setItem('valCurtain', id); } catch (e) {}
    location.href = href;
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const raw = a.getAttribute('href');
    if (!raw || raw === '#' || /^(mailto|tel|https?):/.test(raw)) return;
    const url = new URL(raw, location.href);
    if (url.origin !== location.origin) return;
    const page = url.pathname.split('/').pop() || 'index.html';
    const hash = url.hash.slice(1);
    const id = hash || (page === 'media.html' ? 'media' : 'top');
    e.preventDefault();
    if (page === here) {
      if (hash && hash !== 'top' && !document.getElementById(hash)) return;
      go(id, hash && hash !== 'top' ? hash : '');
    } else leave(url.href, id);
  });
  // arriving from the other page: we're under the curtain; land, then reveal
  let arrived = null;
  try { arrived = sessionStorage.getItem('valCurtain'); sessionStorage.removeItem('valCurtain'); } catch (e) {}
  if ('scrollRestoration' in history && arrived) history.scrollRestoration = 'manual';
  if (arrived) {
    setCurtain(arrived);
    const id = location.hash.slice(1) || (isHome ? 'top' : 'media');
    const land = async () => {
      jump(id);
      const img = document.querySelector('.hero-media img');
      if (img && !img.complete) await Promise.race([new Promise(r => img.addEventListener('load', r, { once: true })), wait(700)]);
      if (document.fonts) await Promise.race([document.fonts.ready, wait(500)]);
      if (document.readyState !== 'complete') await Promise.race([new Promise(r => addEventListener('load', r, { once: true })), wait(900)]);
      jump(id);
      setTimeout(() => enter(id), reduce ? 0 : 120);
      reveal();
    };
    requestAnimationFrame(() => setTimeout(land, 60));
  }

  // ---------- Active-section indicator ----------
  const navItems = [...document.querySelectorAll('.nav-links a[data-sec], .nav-pill')];
  const SECS = ['acerca', 'conferencias', 'tedx', 'contacto'];
  let lastActive = null;
  function updateActive() {
    let cur = isHome ? 'top' : 'media';
    if (isHome) {
      for (const id of SECS) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * .45) cur = id; }
      if (cur === 'tedx') cur = 'conferencias';
    }
    if (cur === lastActive) return; lastActive = cur;
    navItems.forEach(a => a.dataset.sec === cur ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  }
  addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  // Talk CTAs: preselect "Conferencia" and name the talk
  document.querySelectorAll('[data-talk]').forEach(a => a.addEventListener('click', () => {
    const type = document.getElementById('f-type'), msg = document.getElementById('f-msg');
    if (type) type.value = 'Conferencia';
    const note = `Me interesa la conferencia «${a.dataset.talk}». `;
    if (msg && !msg.value.includes(note)) msg.value = note + (msg.value ? '\n\n' + msg.value : '');
  }));

  // TEDx: load the YouTube player only on click (faster page, no third-party load up front)
  document.querySelectorAll('.yt-facade').forEach(btn => btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    f.title = btn.dataset.title || 'TEDx — Valeria de la Torre';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  }));

  // Forms: post to the same Google Apps Script web app as the previous site
  // (URL-encoded body, no custom headers = simple CORS request, no preflight)
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MSG = {
    required: 'Completa este campo.',
    email: 'Revisa tu correo: debe verse como nombre@empresa.com.',
    phone: 'Escribe un teléfono válido (de 7 a 15 dígitos).',
    send: 'No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo en unos minutos.'
  };
  const fieldError = el => {
    const v = el.value.trim();
    if (el.required && !v) return MSG.required;
    if (el.type === 'email' && v && !EMAIL_RE.test(v)) return MSG.email;
    if (el.type === 'tel' && v) { const d = v.replace(/\D/g, '').length; if (d < 7 || d > 15 || /[^\d\s()+\-]/.test(v)) return MSG.phone; }
    return '';
  };
  const showError = (el, msg) => {
    const label = el.closest('.f'); if (!label) return;
    let p = label.querySelector('.f-err');
    if (msg) {
      el.setAttribute('aria-invalid', 'true');
      if (!p) { p = document.createElement('small'); p.className = 'f-err'; p.id = (el.name || 'f') + '-' + Math.random().toString(36).slice(2, 7) + '-err'; label.appendChild(p); el.setAttribute('aria-describedby', p.id); }
      p.textContent = msg;
    } else { el.removeAttribute('aria-invalid'); if (p) p.textContent = ''; }
  };
  document.querySelectorAll('form.cform[action]').forEach(form => {
    const fields = [...form.querySelectorAll('input:not([type=hidden]):not([name=website]), select, textarea')];
    const btn = form.querySelector('button[type=submit]'), btnHTML = btn.innerHTML;
    const err = form.querySelector('.form-error'), ok = form.parentElement.querySelector('.form-success');
    let tried = false;
    // Render time: the server drops anything sent < 3 s after the form appeared (bots)
    // (sent as elapsed ms, measured on the visitor's clock, so clock skew doesn't matter)
    const ts = form.querySelector('[name=ts]'), t0 = Date.now();
    fields.forEach(f => ['input', 'change', 'blur'].forEach(ev => f.addEventListener(ev, () => { if (tried) showError(f, fieldError(f)); })));
    form.addEventListener('submit', async e => {
      e.preventDefault(); tried = true; err.hidden = true;
      let first = null;
      fields.forEach(f => { const m = fieldError(f); showError(f, m); if (m && !first) first = f; });
      if (first) { first.focus(); return; }
      if (ts) ts.value = String(Date.now() - t0);
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Enviando…';
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)), signal: ctrl.signal });
        if (!res.ok) throw new Error('Apps Script ' + res.status);
        const out = await res.json();
        if (!out.ok) throw new Error('Apps Script: ' + out.error);
        form.reset(); form.hidden = true; ok.hidden = false; ok.focus();
      } catch (x) {
        err.textContent = MSG.send; err.hidden = false;
        btn.disabled = false; btn.removeAttribute('aria-busy'); btn.innerHTML = btnHTML;
      } finally { clearTimeout(t); }
    });
  });
})();

// v10: En escena carousel — scroll-snap track, arrows, keys, mouse drag, counter + progress
(() => {
  const root = document.querySelector('.escena'); if (!root) return;
  const track = root.querySelector('.es-track'), slides = [...track.children];
  const prev = root.querySelector('.es-prev'), next = root.querySelector('.es-next');
  const cur = root.querySelector('.es-cur'), bar = root.querySelector('.es-progress span');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');
  const left = el => el.offsetLeft - track.offsetLeft;
  const idx = () => { const x = track.scrollLeft; let b = 0, d = Infinity; slides.forEach((s, i) => { const k = Math.abs(left(s) - x); if (k < d) { d = k; b = i; } }); return b; };
  const max = () => track.scrollWidth - track.clientWidth;
  const update = () => {
    const atEnd = track.scrollLeft >= max() - 2, i = atEnd ? slides.length - 1 : idx();
    cur.textContent = pad(i + 1);
    bar.style.width = (max() > 0 ? 10 + 90 * track.scrollLeft / max() : 100) + '%';
    prev.disabled = track.scrollLeft <= 2; next.disabled = atEnd;
  };
  const goTo = i => { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: Math.min(left(slides[i]), max()), behavior: reduce ? 'auto' : 'smooth' }); };
  const before = () => { const x = track.scrollLeft; let i = 0; slides.forEach((s, k) => { if (left(s) < x - 2) i = k; }); return i; };
  const after = () => { const x = track.scrollLeft; const k = slides.findIndex(s => left(s) > x + 2); return k < 0 ? slides.length - 1 : k; };
  prev.addEventListener('click', () => goTo(before()));
  next.addEventListener('click', () => goTo(after()));
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(after()); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(before()); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });
  let raf = 0; track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update);
  // mouse / pen drag (touch uses native swipe)
  let sx = 0, sl = 0, down = false, moved = false;
  track.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' || e.button) return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (!moved && Math.abs(dx) > 4) { moved = true; track.classList.add('dragging'); } if (moved) track.scrollLeft = sl - dx; });
  addEventListener('pointerup', e => { if (!down) return; down = false; if (!moved) return; const dir = Math.sign(sl - track.scrollLeft); const i = idx(); track.classList.remove('dragging'); goTo(dir > 0 && left(slides[i]) < track.scrollLeft ? i + 1 : (dir < 0 && left(slides[i]) > track.scrollLeft ? i - 1 : i)); });
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  update();
})();

// v11: 'Leer más' for long talk descriptions on small screens (all text visible without JS)
(() => {
  document.querySelectorAll('.talk-text').forEach(box => {
    if (box.querySelectorAll('.talk-desc').length < 3) return;
    box.classList.add('js-clamp');
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'talk-more'; b.setAttribute('aria-expanded', 'false'); b.textContent = 'Leer más';
    b.addEventListener('click', () => { const o = box.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); b.textContent = o ? 'Leer menos' : 'Leer más'; });
    box.appendChild(b);
  });
})();

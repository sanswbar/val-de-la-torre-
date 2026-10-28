/* =============================================
   VALERIA DE LA TORRE — main.js
   Language switch · Scroll animations · Form
   ============================================= */

// ── Language Switch ─────────────────────────────────────────────

let currentLang = 'es';

function applyTranslations(lang) {
  const t = translations[lang];

  // Text content for most elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] === undefined) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t[key];
    } else if (el.tagName === 'OPTION') {
      el.textContent = t[key];
    } else {
      el.textContent = t[key];
    }
  });

  // Placeholder-only fields (label stays as-is, placeholder updates)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Hero title has a line break and italic second line — use innerHTML
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const parts = t.heroTitle.split('\n');
    heroTitle.innerHTML = parts.length === 2
      ? `${parts[0]}<br><em>${parts[1]}</em>`
      : t.heroTitle;
  }

  // Talk subtitles
  ['talk1Subtitle', 'talk2Subtitle'].forEach(key => {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (el) el.textContent = t[key] || '';
  });

  // Multi-paragraph fields
  ['talk1Desc', 'talk2Desc', 'tedDesc'].forEach(key => {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (el && t[key]) {
      el.innerHTML = t[key].split('\n\n').map(p => `<p>${p}</p>`).join('');
    }
  });

  // Visible validation / send errors follow the language
  document.querySelectorAll('[data-error-key]').forEach(el => {
    if (el.dataset.errorKey && t[el.dataset.errorKey]) el.textContent = t[el.dataset.errorKey];
  });
  const formError = document.getElementById('form-error');
  if (formError && !formError.hidden) renderSendError(formError, t);
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn && submitBtn.getAttribute('aria-busy') === 'true') submitBtn.textContent = t.submitSending;

  // Lang toggle button text + aria-label
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = t.langToggle;
    toggleBtn.setAttribute('aria-label', t.langToggleLabel);
  }

  document.documentElement.lang = lang;
}

function switchLang() {
  // Fade the whole page once instead of every node, so it doesn't flicker
  const body = document.body;
  body.classList.add('is-switching-lang');

  setTimeout(() => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyTranslations(currentLang);
    body.classList.remove('is-switching-lang');
  }, 140);
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', switchLang);
  }
  applyTranslations(currentLang);
});


// ── Header: on-dark class solo cuando el hero-photo-side es visible a la izquierda ──

function updateHeaderStyle() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const photo = document.querySelector('.hero-photo-side');
  if (!photo) return;
  // on-dark only while the header's middle line still sits over the hero photo
  const headerMid = header.getBoundingClientRect().height / 2;
  const photoRect = photo.getBoundingClientRect();
  header.classList.toggle('on-dark', photoRect.top < headerMid && photoRect.bottom > headerMid);

  // Fade out site name — desaparece en los primeros 80px de scroll
  const siteName = document.querySelector('.site-name');
  if (siteName) {
    const opacity = Math.max(0, 1 - window.scrollY / 80);
    siteName.style.opacity = opacity;
  }
}

window.addEventListener('scroll', updateHeaderStyle, { passive: true });
window.addEventListener('resize', updateHeaderStyle, { passive: true });
document.addEventListener('DOMContentLoaded', updateHeaderStyle);


// ── Scroll Fade-in via IntersectionObserver ──────────────────────

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  });
} else {
  // If reduced motion, make everything visible immediately
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  });
}


// ── Contact Form ─────────────────────────────────────────────────

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SEND_TIMEOUT_MS = 15000;

// Send-failure message with the direct email as a working fallback
function renderSendError(el, t) {
  el.textContent = `${t.errSend} `;
  const link = document.createElement('a');
  link.href = `mailto:${t.footerEmail}`;
  link.textContent = t.footerEmail;
  el.append(link, '.');
}

// Returns the translation key of the field's problem, or null when it's fine
function fieldErrorKey(field) {
  const value = field.value.trim();
  if (field.type === 'email') {
    if (!value) return 'errEmailEmpty';
    return EMAIL_PATTERN.test(value) ? null : 'errEmailInvalid';
  }
  if (field.required && !value) return field.dataset.error;
  return null;
}

function showFieldError(field, key) {
  const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
  if (!errorEl) return;
  if (key) {
    field.setAttribute('aria-invalid', 'true');
    errorEl.dataset.errorKey = key;
    errorEl.textContent = translations[currentLang][key];
    errorEl.hidden = false;
  } else {
    field.removeAttribute('aria-invalid');
    delete errorEl.dataset.errorKey;
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const formError = document.getElementById('form-error');

  if (!form) return;

  const checkedFields = [...form.querySelectorAll('[data-error]')];
  let attempted = false;

  // After the first submit attempt, errors clear as soon as the field is fixed
  checkedFields.forEach(field => {
    const recheck = () => { if (attempted) showFieldError(field, fieldErrorKey(field)); };
    field.addEventListener('input', recheck);
    field.addEventListener('change', recheck);
    field.addEventListener('blur', recheck);
  });

  function setSending(isSending) {
    const t = translations[currentLang];
    submitBtn.disabled = isSending;
    submitBtn.setAttribute('aria-busy', String(isSending));
    submitBtn.textContent = isSending ? t.submitSending : t.submitBtn;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    formError.hidden = true;

    let firstInvalid = null;
    checkedFields.forEach(field => {
      const key = fieldErrorKey(field);
      showFieldError(field, key);
      if (key && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    setSending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

    try {
      // URL-encoded body with no custom headers keeps this a simple CORS request,
      // which Apps Script accepts without a preflight
      const response = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Apps Script ${response.status}`);
      const result = await response.json();
      if (!result.ok) throw new Error(`Apps Script: ${result.error}`);

      form.reset();
      form.hidden = true;
      document.body.classList.add('form-sent');
      successMsg.classList.add('visible');
      successMsg.focus();
    } catch (err) {
      // The typed message stays in the form; only the error is shown
      renderSendError(formError, translations[currentLang]);
      formError.hidden = false;
      setSending(false);
    } finally {
      clearTimeout(timeout);
    }
  });

  // Talk CTAs preselect the collaboration type and name the talk
  document.querySelectorAll('[data-prefill]').forEach(cta => {
    cta.addEventListener('click', () => {
      const t = translations[currentLang];
      const type = document.getElementById('field-type');
      const desc = document.getElementById('field-desc');
      if (type && !type.value) type.value = 'Conferencia';
      const note = t[cta.dataset.prefill];
      if (desc && note && !desc.value.includes(note.trim())) {
        desc.value = desc.value.trim() ? `${note}\n\n${desc.value}` : note;
      }
      if (attempted) [type, desc].forEach(f => f && showFieldError(f, fieldErrorKey(f)));
    });
  });
});


// ── Mobile CTA bar: out of the way once the form is on screen ───

document.addEventListener('DOMContentLoaded', () => {
  const contact = document.getElementById('contacto');
  const bar = document.querySelector('.mobile-cta-bar');
  if (!contact || !bar || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(([entry]) => {
    bar.classList.toggle('is-hidden', entry.isIntersecting);
  }).observe(contact);
});


// ── Brands carousel: JS-driven scroll with touch/drag ───────────

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.brands-track');
  const wrap  = document.querySelector('.brands-track-wrap');
  if (!track || !wrap) return;

  // Kill CSS animation — JS owns the scroll from here
  track.style.animation = 'none';

  const SPEED = 40; // px per second
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let offset = 0;
  let halfWidth = 0;
  let rafId = null;
  let isDragging = false;
  let isHovered = false;
  let hasFocus = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let last = performance.now();

  function getHalfWidth() {
    return track.scrollWidth / 2;
  }

  // Auto-scroll stops on hover, keyboard focus, and reduced motion; drag still works
  function isPaused() {
    return isDragging || isHovered || hasFocus || reducedMotion.matches;
  }

  function tick(now) {
    if (!isPaused()) {
      const dt = (now - last) / 1000;
      halfWidth = getHalfWidth();
      offset = (offset + SPEED * dt) % halfWidth;
      track.style.transform = `translateX(${-offset}px)`;
    }
    last = now;
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  wrap.addEventListener('mouseenter', () => { isHovered = true; });
  wrap.addEventListener('mouseleave', () => { isHovered = false; });
  wrap.addEventListener('focusin', () => { hasFocus = true; });
  wrap.addEventListener('focusout', () => { hasFocus = false; });

  function onDragStart(x) {
    isDragging = true;
    dragStartX = x;
    dragStartOffset = offset;
  }

  function onDragMove(x) {
    if (!isDragging) return;
    halfWidth = getHalfWidth();
    const delta = dragStartX - x;
    offset = ((dragStartOffset + delta) % halfWidth + halfWidth) % halfWidth;
    track.style.transform = `translateX(${-offset}px)`;
    last = performance.now();
  }

  function onDragEnd() {
    isDragging = false;
    last = performance.now();
  }

  // Touch
  wrap.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
  wrap.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX),  { passive: true });
  wrap.addEventListener('touchend',   onDragEnd);
  wrap.addEventListener('touchcancel', onDragEnd);

  // Mouse
  wrap.addEventListener('mousedown', e => { onDragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => onDragMove(e.clientX));
  window.addEventListener('mouseup', onDragEnd);
});


// ── Smooth scroll for anchor CTAs ───────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
});

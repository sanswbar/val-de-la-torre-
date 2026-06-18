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

  // Lang toggle button text + aria-label
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = t.langToggle;
    toggleBtn.setAttribute('aria-label', t.langToggleLabel);
  }

  document.documentElement.lang = lang;
}

function switchLang() {
  // Fade out all translatable elements
  document.querySelectorAll('[data-i18n], [data-i18n-placeholder]').forEach(el => {
    el.style.transition = 'opacity 120ms ease';
    el.style.opacity = '0';
  });

  setTimeout(() => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyTranslations(currentLang);
    // Fade back in
    document.querySelectorAll('[data-i18n], [data-i18n-placeholder]').forEach(el => {
      el.style.opacity = '1';
    });
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
  const hero = document.getElementById('hero');
  if (!hero) return;
  const heroBottom = hero.getBoundingClientRect().bottom;
  const isDesktop = window.innerWidth > 960;
  if (isDesktop && heroBottom > 0) {
    header.classList.add('on-dark');
  } else {
    header.classList.remove('on-dark');
  }

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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = '…';

    const data = new FormData(form);

    try {
      // CONFIGURACIÓN FORMSPREE:
      // 1. Crear cuenta en https://formspree.io
      // 2. Crear un nuevo formulario vinculado a valedelatorreg@gmail.com
      // 3. Reemplazar el action del form en index.html con la URL que Formspree te da
      //    Ejemplo: https://formspree.io/f/XXXXXXXX
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        form.style.display = 'none';
        successMsg.classList.add('visible');
      } else {
        throw new Error('Form error');
      }
    } catch (err) {
      // Fallback: show error inline
      submitBtn.disabled = false;
      const t = translations[currentLang];
      submitBtn.textContent = t.submitBtn;
      alert(currentLang === 'es'
        ? 'Hubo un problema al enviar. Por favor intenta de nuevo o escribe directamente a valedelatorreg@gmail.com'
        : 'There was a problem sending. Please try again or write directly to valedelatorreg@gmail.com'
      );
    }
  });
});


// ── Brands carousel: drag / swipe to scrub ──────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.brands-track');
  const wrap  = document.querySelector('.brands-track-wrap');
  if (!track || !wrap) return;

  let isDragging = false;
  let startX = 0;
  let currentOffset = 0;
  let animOffset = 0;
  let rafId = null;
  const SPEED = 0.04; // px per ms for auto-scroll

  // Read current CSS animation progress and convert to a pixel offset
  function getAnimOffset() {
    const halfWidth = track.scrollWidth / 2;
    const elapsed = performance.now();
    const duration = 28000;
    return (elapsed % duration) / duration * halfWidth;
  }

  function startDrag(x) {
    isDragging = true;
    startX = x;
    animOffset = getAnimOffset();
    currentOffset = animOffset;
    track.style.animationPlayState = 'paused';
    track.style.animation = 'none';
    track.style.transform = `translateX(${-currentOffset}px)`;
    cancelAnimationFrame(rafId);
  }

  function moveDrag(x) {
    if (!isDragging) return;
    const delta = startX - x;
    const halfWidth = track.scrollWidth / 2;
    currentOffset = ((animOffset + delta) % halfWidth + halfWidth) % halfWidth;
    track.style.transform = `translateX(${-currentOffset}px)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    // Resume auto-scroll from current position
    let last = performance.now();
    function autoScroll(now) {
      const dt = now - last;
      last = now;
      const halfWidth = track.scrollWidth / 2;
      currentOffset = (currentOffset + dt * SPEED) % halfWidth;
      track.style.transform = `translateX(${-currentOffset}px)`;
      rafId = requestAnimationFrame(autoScroll);
    }
    rafId = requestAnimationFrame(autoScroll);
  }

  // Touch
  wrap.addEventListener('touchstart', e => startDrag(e.touches[0].clientX), { passive: true });
  wrap.addEventListener('touchmove',  e => moveDrag(e.touches[0].clientX),  { passive: true });
  wrap.addEventListener('touchend',   endDrag);

  // Mouse
  wrap.addEventListener('mousedown', e => { startDrag(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);
});


// ── Smooth scroll for anchor CTAs ───────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/* Alfredits · interacciones: línea de tiempo, entradas, 3D al hacer scroll,
   reels que se reproducen al verse, gráfica y formulario. */
(() => {
  const cfg = window.ALF || {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Entradas escalonadas */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      revealIO.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  // retraso escalonado entre elementos hermanos de la misma sección
  $$('section, footer').forEach((sec) => {
    $$('[data-reveal]', sec).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`));
  });
  $$('[data-reveal], [data-bars]').forEach((el) => revealIO.observe(el));

  /* ---------- Scroll: línea de tiempo, nav, 3D */
  const root = document.documentElement;
  const nav = $('.nav');
  const hero = $('[data-hero]');
  const heroPhone = $('.phone--hero');
  const iso = $('[data-iso]');
  const reelPhones = $$('.cat__reels .phone');
  const waFloat = $('.wa-float');
  const contact = $('#contacto');
  const chart = $('[data-bars]');
  let pointerX = 0;
  let pointerY = 0;
  let ticking = false;

  function frame() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    root.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    nav.classList.toggle('is-solid', y > 24);

    if (waFloat && contact) {
      const r = contact.getBoundingClientRect();
      const c = chart ? chart.getBoundingClientRect() : null;
      const overChart = c && window.innerWidth < 1081 && c.top < vh && c.bottom > 0;
      waFloat.classList.toggle('is-hidden', y < vh * 0.6 || overChart || (r.top < vh * 0.5 && r.bottom > vh * 0.5));
    }
    if (reduce) return;

    // Hero: el móvil y el isotipo se enderezan al bajar
    if (hero) {
      const p = clamp(y / (hero.offsetHeight * 0.8));
      if (heroPhone) {
        heroPhone.style.setProperty('--ph-y', `${(-16 + 16 * p + pointerX * 8).toFixed(2)}deg`);
        heroPhone.style.setProperty('--ph-x', `${(6 - 6 * p - pointerY * 6).toFixed(2)}deg`);
      }
      if (iso) {
        iso.style.setProperty('--iso-y', `${(-24 + 70 * p + pointerX * 14).toFixed(2)}deg`);
        iso.style.setProperty('--iso-x', `${(10 + 8 * p - pointerY * 10).toFixed(2)}deg`);
      }
    }

    // Reels: entran girando en 3D según su posición en pantalla
    for (const ph of reelPhones) {
      const r = ph.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const enter = clamp((vh - r.top) / (vh * 0.55));
      ph.style.setProperty('--in', (1 - enter).toFixed(3));
    }
  }
  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (ev) => {
      pointerX = ev.clientX / window.innerWidth - 0.5;
      pointerY = ev.clientY / window.innerHeight - 0.5;
      request();
    }, { passive: true });
  }
  frame();

  /* ---------- Reels: cargan y suenan solo cuando hace falta */
  const videos = $$('.phone__video');
  const load = (v) => {
    if (v.dataset.src && !v.src) {
      v.src = v.dataset.src;
      v.load();
    }
  };
  const play = (v) => {
    load(v);
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };
  const videoIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) {
        if (!reduce || !v.muted) play(v);
        else load(v);
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { threshold: 0.35 });
  videos.forEach((v) => videoIO.observe(v));

  function setSound(btn, on) {
    const v = btn.closest('.phone').querySelector('video');
    v.muted = !on;
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('.sr-only').textContent = on ? btn.dataset.off : btn.dataset.on;
    if (on) play(v);
  }
  function toggleSound(btn) {
    const turnOn = btn.getAttribute('aria-pressed') !== 'true';
    if (turnOn) {
      // solo un reel con sonido a la vez
      $$('[data-sound][aria-pressed="true"]').forEach((b) => b !== btn && setSound(b, false));
    }
    setSound(btn, turnOn);
  }
  $$('[data-sound]').forEach((btn) => btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleSound(btn);
  }));
  $$('.phone__screen').forEach((scr) => scr.addEventListener('click', () => toggleSound($('[data-sound]', scr))));

  /* ---------- Pestañas de sectores */
  const tabs = $$('[data-tab]');
  if (tabs.length) {
    const tabIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.dataset.cat;
        tabs.forEach((t) => {
          const on = t.dataset.tab === id;
          t.classList.toggle('is-active', on);
          if (on) {
            t.setAttribute('aria-current', 'true');
            const list = t.closest('ul');
            list.scrollTo({ left: t.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
          } else {
            t.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-cat]').forEach((c) => tabIO.observe(c));
  }

  /* ---------- Formulario */
  const form = $('[data-form]');
  if (!form) return;
  const status = $('.form__status', form);
  const submit = $('button[type="submit"]', form);
  const msg = cfg.msg || {};
  const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

  form.addEventListener('change', (ev) => {
    const f = ev.target.closest('.field');
    if (f) f.classList.remove('is-invalid');
  });
  form.addEventListener('input', (ev) => {
    if (ev.target.name === 'email' && emailOk(ev.target.value.trim())) {
      ev.target.closest('.field').classList.remove('is-invalid');
      $('#f-email-error').hidden = true;
      ev.target.removeAttribute('aria-invalid');
    }
  });

  function validate() {
    let first = null;
    ['objetivo', 'duracion', 'volumen'].forEach((name) => {
      const ok = form.querySelector(`input[name="${name}"]:checked`);
      const field = form.querySelector(`input[name="${name}"]`).closest('.field');
      field.classList.toggle('is-invalid', !ok);
      if (!ok && !first) first = form.querySelector(`input[name="${name}"]`);
    });
    const email = form.elements.email;
    const good = emailOk(email.value.trim());
    email.closest('.field').classList.toggle('is-invalid', !good);
    $('#f-email-error').hidden = good;
    if (good) email.removeAttribute('aria-invalid');
    else email.setAttribute('aria-invalid', 'true');
    if (!good && !first) first = email;
    return first;
  }

  function data() {
    const d = {};
    ['objetivo', 'duracion', 'volumen', 'referencia', 'nombre', 'email'].forEach((n) => {
      const el = form.elements[n];
      d[n] = (el && el.value ? el.value : '').trim();
    });
    return d;
  }

  function whatsapp(d) {
    const L = cfg.labels || {};
    const lines = [msg.f_wa_intro, ''];
    Object.keys(d).forEach((k) => d[k] && lines.push(`${L[k] || k}: ${d[k]}`));
    return `https://wa.me/${cfg.wa}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.className = 'form__status';
    status.textContent = '';
    const bad = validate();
    if (bad) {
      status.classList.add('is-error');
      status.textContent = msg.f_falta;
      bad.focus();
      return;
    }
    if (form.elements.botcheck.checked) return;
    const d = data();

    // Sin clave de Web3Forms: la solicitud sale por WhatsApp
    if (!cfg.key) {
      window.open(whatsapp(d), '_blank', 'noopener');
      return;
    }

    submit.disabled = true;
    submit.textContent = msg.f_enviando;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: cfg.key,
          subject: msg.f_asunto,
          from_name: 'Alfredits web',
          replyto: d.email,
          idioma: cfg.lang,
          ...d,
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.success) throw new Error(out.message || res.status);
      form.reset();
      status.classList.add('is-ok');
      status.textContent = msg.f_ok;
    } catch (err) {
      status.classList.add('is-error');
      status.innerHTML = '';
      const a = document.createElement('a');
      a.href = whatsapp(d);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = msg.f_error;
      status.append(a);
    } finally {
      submit.disabled = false;
      submit.textContent = msg.f_enviar;
    }
  });
})();

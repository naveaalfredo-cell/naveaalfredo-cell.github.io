// Pruebas de funcionamiento: errores, archivos, sonido, formulario, enlaces.
// Uso: node tools/pruebas.mjs <url> [ancho]
import { Browser, sleep } from 'file:///C:/Users/Usuario/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const [url, w = '1440'] = process.argv.slice(2);
const b = await Browser.launch({ width: +w, height: 900 });
const ok = (c, m) => console.log((c ? 'OK   ' : 'FALLA') + ' ' + m);
try {
  const p = await b.newPage({ width: +w, height: 900, mobile: +w < 700 });
  const errs = [];
  p.on?.('Runtime.exceptionThrown', (e) => errs.push(e));
  await p.goto(url, { settleMs: 2000 });
  // instrumentación
  await p.eval(`(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; };
    window.__errs = []; window.addEventListener('error', e => window.__errs.push(String(e.message))); })()`);
  const assets = await p.eval(`(async () => {
    const urls = new Set();
    document.querySelectorAll('img[src],link[rel~=icon],link[rel=stylesheet],link[rel=preload],script[src],video[poster]').forEach(el => {
      const u = el.getAttribute('src') || el.getAttribute('href') || el.getAttribute('poster'); if (u && !u.startsWith('http')) urls.add(new URL(u, location.href).href); });
    document.querySelectorAll('video[data-src]').forEach(v => urls.add(new URL(v.dataset.src, location.href).href));
    const bad = [];
    for (const u of urls) { const r = await fetch(u, { method: 'HEAD' }); if (!r.ok) bad.push(r.status + ' ' + u); }
    return JSON.stringify({ n: urls.size, bad });
  })()`);
  const a = JSON.parse(assets); ok(!a.bad.length, `archivos locales (${a.n}) ${a.bad.join(', ')}`);
  const fonts = await p.eval(`(async () => { await document.fonts.ready; return JSON.stringify([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family)); })()`);
  ok(fonts.includes('Coolvetica') && fonts.includes('Poppins'), 'fuentes cargadas ' + fonts);
  const ids = await p.eval(`JSON.stringify([...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.querySelector(h)))`);
  ok(ids === '[]', 'anclas internas ' + ids);
  const dup = await p.eval(`(() => { const s = {}; document.querySelectorAll('[id]').forEach(e => s[e.id] = (s[e.id]||0)+1); return JSON.stringify(Object.keys(s).filter(k => s[k] > 1)); })()`);
  ok(dup === '[]', 'ids únicos ' + dup);
  // vídeo del hero se reproduce
  await sleep(2500);
  const hero = await p.eval(`(() => { const v = document.querySelector('.phone--hero video'); return JSON.stringify({ src: !!v.src, paused: v.paused, t: v.currentTime }); })()`);
  ok(JSON.parse(hero).src && !JSON.parse(hero).paused, 'reel del hero se reproduce ' + hero);
  // sonido: solo uno a la vez
  await p.eval(`(async () => { const bs = document.querySelectorAll('[data-sound]'); bs[1].scrollIntoView({block:'center'}); await new Promise(r=>setTimeout(r,600)); bs[1].click(); bs[2].click(); })()`);
  await sleep(800);
  const snd = await p.eval(`JSON.stringify([...document.querySelectorAll('[data-sound]')].map(b => b.getAttribute('aria-pressed') + ':' + b.closest('.phone').querySelector('video').muted))`);
  const arr = JSON.parse(snd);
  ok(arr.filter(x => x.startsWith('true')).length === 1 && arr[2] === 'true:false', 'sonido: un solo reel a la vez ' + snd);
  // formulario vacío
  await p.eval(`document.querySelector('[data-form] button[type=submit]').click()`);
  await sleep(300);
  const st = await p.eval(`JSON.stringify({ msg: document.querySelector('.form__status').textContent, inval: document.querySelectorAll('.field.is-invalid').length, focus: document.activeElement.name })`);
  ok(JSON.parse(st).inval === 4, 'validación con campos vacíos ' + st);
  // email mal
  await p.eval(`(() => { const f = document.querySelector('[data-form]');
    f.querySelector('input[name=objetivo]').click(); f.querySelectorAll('input[name=duracion]')[1].click(); f.querySelectorAll('input[name=volumen]')[2].click();
    f.elements.referencia.value = 'https://www.instagram.com/reel/ejemplo'; f.elements.nombre.value = 'Prueba'; f.elements.email.value = 'malo@'; f.querySelector('button[type=submit]').click(); })()`);
  await sleep(300);
  const st2 = await p.eval(`JSON.stringify({ inval: document.querySelectorAll('.field.is-invalid').length, err: !document.getElementById('f-email-error').hidden })`);
  ok(JSON.parse(st2).inval === 1 && JSON.parse(st2).err, 'correo inválido detectado ' + st2);
  await p.eval(`(() => { const f = document.querySelector('[data-form]'); f.elements.email.value = 'cliente@ejemplo.com'; f.elements.email.dispatchEvent(new Event('input', {bubbles:true})); f.querySelector('button[type=submit]').click(); })()`);
  await sleep(500);
  const op = JSON.parse(await p.eval(`JSON.stringify(window.__opened)`));
  ok(op.length === 1 && op[0].startsWith('https://wa.me/584245738444?text='), 'envío por WhatsApp: ' + decodeURIComponent(op[0] || '').slice(0, 220).replace(/\n/g, ' | '));
  const pe = await p.eval(`JSON.stringify(window.__errs)`);
  ok(pe === '[]' && !errs.length, 'sin errores de JavaScript ' + pe);
  const ov = await p.eval(`document.documentElement.scrollWidth - window.innerWidth`);
  ok(+ov <= 0, 'sin scroll horizontal (' + ov + 'px)');
} finally { await b.close(); }

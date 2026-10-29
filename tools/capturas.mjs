// Capturas de la web por pantallas, para revisar el diseño.
// Uso: node tools/capturas.mjs <url> <carpeta> [ancho] [alto]
import { Browser, sleep } from 'file:///C:/Users/Usuario/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
const width = +w, height = +h;
const b = await Browser.launch({ width, height });
const errors = [];
try {
  const p = await b.newPage({ width, height, mobile: width < 700 });
  p.on?.('Runtime.exceptionThrown', (e) => errors.push(e.exceptionDetails?.exception?.description));
  await p.goto(url, { settleMs: 2500 });
  const total = await p.eval('document.documentElement.scrollHeight');
  let i = 0;
  for (let y = 0; y < total; y += height * 0.9) {
    await p.eval(`window.scrollTo(0, ${Math.round(y)})`);
    await sleep(900);
    await p.screenshot({ path: `${out}/s${String(i++).padStart(2, '0')}.jpg`, quality: 60 });
  }
  const errs = await p.eval('JSON.stringify(window.__errs || [])');
  console.log(`${i} capturas, alto ${total}px`, errors.length ? errors : '', errs);
} finally {
  await b.close();
}

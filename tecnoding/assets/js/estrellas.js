// Productos estrella del inicio: relojes modelados en 3D con Three.js.
// Al bajar por la página el reloj gira de verdad y pasa al siguiente; también se puede arrastrar.
// Los productos del mes se eligen en ESTRELLAS (tools/productos.py); aquí están las recetas de cada modelo.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const RECETAS = {
  t900: { forma: "cuadrada", w: 4.5, h: 5.3, r: 1.05, caja: 0xb9b3a8, correa: 0xe9e2d3, ondas: true, corona: 0xd9472b, pantalla: "ultra" },
  serie11: { forma: "cuadrada", w: 4.1, h: 4.9, r: 1.0, caja: 0x1b1c20, correa: 0x141518, ondas: false, corona: 0x2a2b30, pantalla: "fluido" },
  watch7: { forma: "redonda", w: 4.7, h: 4.7, r: 2.35, caja: 0xc9ccd1, correa: 0x15161a, ondas: true, corona: 0xc9ccd1, pantalla: "anillos" },
};

const lista = window.ESTRELLAS || [];
const C = window.CATALOGO || {};
const canvas = document.getElementById("show-canvas");
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);

/* ---------- Pantallas dibujadas (muestran la hora real) ---------- */
function pantalla(tipo) {
  const c = document.createElement("canvas");
  c.width = 768; c.height = tipo === "anillos" ? 768 : 900;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const g = c.getContext("2d"), W = c.width, H = c.height;
  const anillo = (x, y, r, ancho, color, frac) => {
    g.lineCap = "round"; g.lineWidth = ancho;
    g.strokeStyle = "rgba(255,255,255,.1)"; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    g.strokeStyle = color; g.beginPath(); g.arc(x, y, r, -1.57, -1.57 + 6.283 * frac); g.stroke();
  };
  const texto = (t, x, y, tam, color = "#fff", peso = 700) => {
    g.font = `${peso} ${tam}px Montserrat, Arial, sans-serif`; g.fillStyle = color;
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, x, y);
  };
  tex.pintar = () => {
    const d = new Date(), hh = String(d.getHours() % 12 || 12).padStart(2, "0"), mm = String(d.getMinutes()).padStart(2, "0");
    g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
    if (tipo === "ultra") {
      anillo(190, 190, 88, 24, "#FF9F0A", 0.7); anillo(578, 190, 88, 24, "#FF453A", 0.55);
      texto(hh + ":" + mm, W / 2, H / 2 - 20, 210, "#fff", 800);
      for (let i = 0; i < 44; i++) { g.fillStyle = i > 30 && i < 36 ? "#FF453A" : "#ddd"; const a = 30 + 40 * Math.abs(Math.sin(i * 0.7)); g.fillRect(100 + i * 13, H / 2 + 165 - a, 5, a); }
      anillo(190, 730, 80, 20, "#30D158", 0.8); anillo(190, 730, 50, 20, "#FF375F", 0.6);
      anillo(578, 730, 80, 22, "#64D2FF", 0.65); texto("82", 578, 730, 60);
    } else if (tipo === "fluido") {
      const m = g.createLinearGradient(160, 150, 620, 760);
      ["#FFB000", "#FF4D6D", "#7B4DFF", "#23B5FF"].forEach((col, i) => m.addColorStop(i / 3, col));
      g.fillStyle = m; g.beginPath(); g.moveTo(420, 130);
      g.bezierCurveTo(680, 90, 700, 400, 560, 480); g.bezierCurveTo(690, 620, 520, 800, 370, 720);
      g.bezierCurveTo(210, 760, 120, 560, 240, 460); g.bezierCurveTo(90, 340, 230, 170, 420, 130); g.fill();
      const cx = W / 2, cy = H / 2, ah = ((d.getHours() % 12) + d.getMinutes() / 60) * 0.5236, am = d.getMinutes() * 0.1047;
      g.strokeStyle = "#fff"; g.lineCap = "round"; g.lineWidth = 20;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(ah) * 170, cy - Math.cos(ah) * 170); g.stroke();
      g.lineWidth = 14; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(am) * 280, cy - Math.cos(am) * 280); g.stroke();
      g.fillStyle = "#fff"; g.beginPath(); g.arc(cx, cy, 20, 0, 7); g.fill();
    } else {
      texto(hh + ":" + mm, W / 2, 245, 170, "#fff", 700);
      texto(d.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" }), W / 2, 345, 44, "#ddd", 600);
      anillo(W / 2, 545, 118, 30, "#30D158", 0.72); anillo(W / 2, 545, 78, 26, "#FF375F", 0.58);
      texto("8540", W / 2, 545, 44); anillo(170, 500, 58, 14, "#FF453A", 0.75); anillo(598, 500, 58, 14, "#64D2FF", 0.6);
      texto("75", 170, 500, 40); texto("82", 598, 500, 40);
    }
    tex.needsUpdate = true;
  };
  tex.pintar();
  return tex;
}

/* ---------- Geometría ---------- */
function contorno(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

// Correa: una banda que nace arriba de la caja, da la vuelta por detrás y vuelve abajo
function correa(R, material) {
  const a = R.h / 2 - 0.25;
  const curva = new THREE.CatmullRomCurve3([
    [0, a, -0.45], [0, a + 1.1, -1.0], [0, a + 1.5, -2.6], [0, a + 0.7, -4.5], [0, 0, -5.5],
    [0, -a - 0.7, -4.5], [0, -a - 1.5, -2.6], [0, -a - 1.1, -1.0], [0, -a, -0.45],
  ].map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.5);
  const pasos = 340, lados = 28, ancho = R.forma === "redonda" ? 1.32 : R.w * 0.42, grueso = 0.17;
  const pos = [], idx = [], X = new THREE.Vector3(1, 0, 0);
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos, P = curva.getPointAt(t), T = curva.getTangentAt(t), N = new THREE.Vector3().crossVectors(X, T).normalize();
    const onda = R.ondas ? 1 + 0.45 * Math.max(0, Math.sin(t * 150)) : 1;
    const aw = ancho * (R.ondas ? 1 + 0.035 * Math.sin(t * 150) : 1);
    for (let j = 0; j < lados; j++) {
      const f = (j / lados) * Math.PI * 2, cx = Math.cos(f), cy = Math.sin(f);
      // sección de esquinas muy redondeadas
      const u = Math.sign(cx) * Math.pow(Math.abs(cx), 0.45) * aw, v = Math.sign(cy) * Math.pow(Math.abs(cy), 0.75) * grueso * onda;
      pos.push(P.x + X.x * u + N.x * v, P.y + X.y * u + N.y * v, P.z + X.z * u + N.z * v);
    }
  }
  for (let i = 0; i < pasos; i++) for (let j = 0; j < lados; j++) {
    const a1 = i * lados + j, b1 = i * lados + (j + 1) % lados, c1 = a1 + lados, d1 = b1 + lados;
    idx.push(a1, c1, b1, b1, c1, d1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const grupo = new THREE.Group();
  grupo.add(new THREE.Mesh(g, material));
  // agujeros de la hebilla
  const negro = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.9 });
  for (let k = 0; k < 7; k++) {
    const t = 0.62 + k * 0.042, P = curva.getPointAt(t), T = curva.getTangentAt(t), N = new THREE.Vector3().crossVectors(X, T).normalize();
    const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.18, 4, 12), negro);
    h.position.copy(P).addScaledVector(N, grueso * 1.02);
    h.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(T, X, N));
    h.scale.z = 0.12;
    grupo.add(h);
  }
  return grupo;
}

function reloj(nombre) {
  const R = RECETAS[nombre], g = new THREE.Group();
  const cajaMat = new THREE.MeshPhysicalMaterial({ color: R.caja, metalness: 1, roughness: nombre === "serie11" ? 0.22 : 0.3, clearcoat: 0.4, clearcoatRoughness: 0.25 });
  const forma = contorno(R.w, R.h, R.r);
  const prof = 0.72, bisel = 0.2;
  const caja = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: prof, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel, bevelSegments: 10, curveSegments: 48 }), cajaMat);
  caja.position.z = -prof - bisel;
  g.add(caja);

  // cristal negro y pantalla
  const m = 0.13, wi = R.w - m * 2, hi = R.h - m * 2, ri = Math.max(0.2, R.r - m);
  const cristal = new THREE.Mesh(new THREE.ShapeGeometry(contorno(wi + 0.2, hi + 0.2, ri + 0.1), 48),
    new THREE.MeshPhysicalMaterial({ color: 0x020202, roughness: 0.1, envMapIntensity: 0.25 }));
  cristal.position.z = 0.012;
  g.add(cristal);
  const tex = pantalla(R.pantalla);
  const inset = R.forma === "redonda" ? 0.16 : 0.22, ws = wi - inset * 2, hs = hi - inset * 2;
  const geoP = new THREE.ShapeGeometry(contorno(ws, hs, Math.max(0.2, ri - inset)), 48);
  const uv = geoP.attributes.uv, xy = geoP.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, xy.getX(i) / ws + 0.5, xy.getY(i) / hs + 0.5);
  const pantallaM = new THREE.Mesh(geoP, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  pantallaM.position.z = 0.024;
  g.add(pantallaM);
  // un reflejo muy leve encima, como el cristal real
  const brillo = new THREE.Mesh(geoP, new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.07, color: 0xffffff, roughness: 0.05, metalness: 1 }));
  brillo.position.z = 0.03;
  g.add(brillo);
  g.userData.pantalla = tex;

  // corona y botón
  const metal = new THREE.MeshStandardMaterial({ color: R.corona === 0xd9472b ? 0xb9b3a8 : R.corona, metalness: 1, roughness: 0.28 });
  const lado = R.w / 2 + bisel;
  const corona = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.34, 36), metal);
  corona.rotation.z = Math.PI / 2; corona.position.set(lado + 0.13, R.forma === "redonda" ? 0.55 : 0.65, -0.5);
  g.add(corona);
  if (R.corona === 0xd9472b) {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 12, 36), new THREE.MeshStandardMaterial({ color: R.corona, roughness: 0.4 }));
    aro.rotation.y = Math.PI / 2; aro.position.set(lado + 0.31, 0.65, -0.5);
    g.add(aro);
  }
  const boton = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.55, 6, 16), metal);
  boton.position.set(lado + 0.03, R.forma === "redonda" ? -0.55 : -0.7, -0.5);
  g.add(boton);

  g.add(correa(R, new THREE.MeshPhysicalMaterial({ color: R.correa, roughness: 0.62, sheen: 0.5, sheenRoughness: 0.6, clearcoat: 0.08 })));

  // centra el conjunto para que gire sobre su eje
  const pivote = new THREE.Group();
  g.position.z = 2.4;
  pivote.add(g);
  pivote.userData.pantalla = tex;
  return pivote;
}

/* ---------- Escena ---------- */
function iniciar() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  document.documentElement.classList.add("js-3d");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const escena = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  escena.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const luz = new THREE.DirectionalLight(0xffffff, 1.6); luz.position.set(4, 8, 10); escena.add(luz);
  const camara = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  const modelos = lista.map((e) => reloj(e.modelo));
  const raiz = new THREE.Group();
  modelos.forEach((m) => { m.visible = false; raiz.add(m); });
  escena.add(raiz);

  let movil = false;
  function medir() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    movil = w < 860;
    camara.position.set(0, 0, movil ? 36 : 25);
    camara.updateProjectionMatrix();
    raiz.position.set(movil ? 0 : 3.6, movil ? 3.6 : 0, 0);
  }
  addEventListener("resize", medir);
  medir();

  // arrastrar para girar
  let arrastre = 0, destinoArrastre = 0, tomando = false, x0 = 0;
  canvas.addEventListener("pointerdown", (e) => { tomando = true; x0 = e.clientX; });
  addEventListener("pointermove", (e) => { if (tomando) { destinoArrastre += (e.clientX - x0) * 0.01; x0 = e.clientX; } });
  addEventListener("pointerup", () => { tomando = false; });

  /* ---------- Sincroniza textos con el producto activo ---------- */
  const nombres = [...document.querySelectorAll(".show-list button")];
  const seccion = $("escaparate");
  let actual = -1;
  function poner(k) {
    if (k === actual) return;
    actual = k;
    const e = lista[k], p = C[e.id];
    nombres.forEach((b, j) => b.setAttribute("aria-pressed", String(j === k)));
    $("show-name").textContent = p.n;
    $("show-spec").textContent = e.frase;
    $("show-price").textContent = "$" + String(p.p).replace(".", ",");
    $("show-add").dataset.add = e.id;
    $("show-more").href = "#producto/" + e.id;
    if (window.gsap && !quieto) gsap.fromTo("#show-copy > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out", overwrite: true });
  }
  nombres.forEach((b, k) => b.addEventListener("click", () => {
    const alto = seccion.offsetHeight - innerHeight;
    scrollTo({ top: seccion.offsetTop + alto * ((k + 0.5) / lista.length), behavior: quieto ? "auto" : "smooth" });
  }));

  const ease = (t) => t * t * (3 - 2 * t);
  let suave = 0;
  function cuadro(ms) {
    const alto = seccion.offsetHeight - innerHeight;
    const prog = Math.min(1, Math.max(0, (scrollY - seccion.offsetTop) / alto));
    suave += (prog - suave) * (quieto ? 1 : 0.09);
    arrastre += (destinoArrastre - arrastre) * 0.1;
    const n = lista.length, tramo = Math.min(n - 0.0001, suave * n), k = Math.floor(tramo), f = tramo - k;
    poner(k);
    modelos.forEach((m, i) => { m.visible = i === k; });
    const m = modelos[k];
    // cada reloj entra de lado, da una vuelta completa y sale girando hacia el siguiente
    const entrada = k === 0 ? 1 : ease(Math.min(1, f / 0.16)), salida = k === n - 1 ? 0 : ease(Math.max(0, (f - 0.84) / 0.16));
    m.rotation.y = -0.5 + f * Math.PI * 2 + arrastre + (quieto ? 0 : Math.sin(ms / 1800) * 0.03);
    m.rotation.x = 0.1 + Math.sin(f * Math.PI) * 0.1;
    const esc = (0.55 + 0.45 * entrada) * (1 - 0.45 * salida);
    m.scale.setScalar(esc);
    m.position.y = (1 - entrada) * -5 + salida * 5;
    renderer.render(escena, camara);
    requestAnimationFrame(cuadro);
  }
  document.fonts.ready.then(() => modelos.forEach((m) => m.userData.pantalla.pintar()));
  setInterval(() => modelos.forEach((m) => m.userData.pantalla.pintar()), 30000);
  requestAnimationFrame(cuadro);
}
if (canvas && lista.length) iniciar();

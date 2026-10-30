(() => {
  const C = window.CATALOGO || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dinero = (n) => "$" + (Math.round(n * 100) / 100).toString().replace(".", ",");
  const conGsap = () => window.gsap && !quieto;

  /* ---------- Logo: eslogan del ancho del logotipo e isotipo de la misma altura ---------- */
  function ajustarLogos() {
    $$(".lockup").forEach((l) => {
      const img = $(".lockup-logo", l), tag = $(".lockup-tag", l);
      const ancho = img.getBoundingClientRect().width;
      if (!ancho) return;
      const inset = ancho * 0.006;
      tag.style.fontSize = "10px";
      const fs = (10 * (ancho - 2 * inset)) / (tag.scrollWidth - 3);
      tag.style.fontSize = fs + "px";
      tag.style.marginRight = -0.3 * fs + "px";
      tag.style.marginLeft = inset + "px";
      const iso = l.previousElementSibling;
      if (iso) iso.style.setProperty("--lockup-h", l.getBoundingClientRect().height + "px");
    });
  }
  document.fonts.ready.then(ajustarLogos);
  addEventListener("resize", ajustarLogos);
  $$(".lockup-logo").forEach((i) => (i.complete ? ajustarLogos() : i.addEventListener("load", ajustarLogos)));

  /* ---------- Barra: azul con logo blanco; sobre fondos azules se invierte ---------- */
  const barra = $("#topbar");
  const oscuras = $$(".cat-azul, .cat-noche, .close, .footer");
  function revisarBarra() {
    const y = barra.offsetHeight / 2;
    barra.classList.toggle("is-light", oscuras.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
  }
  addEventListener("scroll", revisarBarra, { passive: true });
  revisarBarra();

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let relojToast;
  function avisar(txt) {
    toast.textContent = txt;
    toast.classList.add("show");
    clearTimeout(relojToast);
    relojToast = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  /* ---------- Carrito (se guarda en este navegador) ---------- */
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem("tecnoding-carrito") || "[]").filter((i) => C[i.id]); } catch (e) { carrito = []; }
  const guardar = () => { try { localStorage.setItem("tecnoding-carrito", JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ } };
  const total = () => carrito.reduce((s, i) => s + i.precio * i.cant, 0);

  function agregar(id, variante, cant = 1, origen) {
    const p = C[id];
    if (!p) return;
    const v = variante || (p.v.length ? p.v[0][0] : "");
    const precio = v ? (p.v.find((x) => x[0] === v) || [, p.p])[1] : p.p;
    const linea = carrito.find((i) => i.id === id && i.v === v);
    if (linea) linea.cant += cant; else carrito.push({ id, v, precio, cant });
    guardar();
    pintarCarrito();
    volar(origen, id);
    const cuenta = $("#cart-count");
    cuenta.classList.remove("pop"); void cuenta.offsetWidth; cuenta.classList.add("pop");
    avisar("¡Ding! " + p.n + " va en tu carrito");
  }

  function volar(origen, id) {
    if (!origen || quieto) return;
    const desde = origen.getBoundingClientRect(), hasta = $("#cart-open").getBoundingClientRect();
    const img = document.createElement("img");
    img.src = "assets/img/productos/" + id + ".webp";
    img.className = "fly";
    const lado = Math.min(140, desde.width);
    Object.assign(img.style, { left: desde.left + desde.width / 2 - lado / 2 + "px", top: desde.top + desde.height / 2 - lado / 2 + "px", width: lado + "px", height: lado + "px" });
    document.body.appendChild(img);
    const dx = hasta.left + hasta.width / 2 - (desde.left + desde.width / 2), dy = hasta.top + hasta.height / 2 - (desde.top + desde.height / 2);
    img.animate([
      { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px,${dy - 80}px) scale(.6) rotate(-12deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px,${dy}px) scale(.12) rotate(-20deg)`, opacity: 0.2 },
    ], { duration: 750, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => img.remove();
  }

  function pintarCarrito() {
    const n = carrito.reduce((s, i) => s + i.cant, 0);
    const cuenta = $("#cart-count");
    cuenta.textContent = n;
    cuenta.hidden = n === 0;
    $("#cart-open").setAttribute("aria-label", n ? `Abrir carrito, ${n} productos` : "Abrir carrito");
    $("#cart-empty").hidden = n > 0;
    $("#cart-foot").hidden = n === 0;
    $("#cart-total").textContent = $("#cart-total-2").textContent = dinero(total());
    $("#cart-items").innerHTML = carrito.map((i, k) => `
      <li class="cart-item">
        <span class="cart-item-img"><img src="assets/img/productos/${i.id}.webp" alt=""></span>
        <div><b>${C[i.id].n}</b>${i.v ? `<small>${i.v}</small>` : ""}<small>${dinero(i.precio)} c/u</small>
          <div class="qty"><button type="button" data-linea="${k}" data-d="-1" aria-label="Quitar uno">−</button><output>${i.cant}</output><button type="button" data-linea="${k}" data-d="1" aria-label="Agregar uno">+</button></div>
        </div>
        <div><span class="cart-item-price">${dinero(i.precio * i.cant)}</span><button type="button" class="cart-item-del" data-borrar="${k}">Quitar</button></div>
      </li>`).join("");
  }

  $("#cart-items").addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.borrar != null) carrito.splice(+b.dataset.borrar, 1);
    else if (b.dataset.linea != null) {
      const l = carrito[+b.dataset.linea];
      l.cant += +b.dataset.d;
      if (l.cant < 1) carrito.splice(+b.dataset.linea, 1);
    }
    guardar();
    pintarCarrito();
  });

  /* ---------- Diálogos accesibles (ficha y carrito) ---------- */
  let ultimoFoco = null;
  function abrir(dlg, enfocar) {
    ultimoFoco = document.activeElement;
    dlg.hidden = false;
    document.documentElement.style.overflow = "hidden";
    if (conGsap()) gsap.fromTo($(".sheet-panel, .cart-panel", dlg), dlg.id === "cart" ? { x: 60, opacity: 0 } : { y: 40, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "transform,translate,opacity" });
    (enfocar || $("button, [href], input", dlg)).focus();
  }
  function cerrar(dlg) {
    dlg.hidden = true;
    if ($("#sheet").hidden && $("#cart").hidden) document.documentElement.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
  }
  document.addEventListener("keydown", (ev) => {
    const abierto = !$("#sheet").hidden ? $("#sheet") : !$("#cart").hidden ? $("#cart") : null;
    if (!abierto) return;
    if (ev.key === "Escape") cerrar(abierto);
    if (ev.key === "Tab") {
      const f = $$("button:not([hidden]), [href], input:not([type=radio]), input[type=radio]:checked, select", abierto).filter((e) => e.offsetParent !== null);
      if (!f.length) return;
      if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Ficha de producto con fotos reales ---------- */
  const sheet = $("#sheet");
  let fichaId = null, fichaCant = 1;
  function abrirFicha(id) {
    const p = C[id];
    if (!p) return;
    fichaId = id; fichaCant = 1;
    $("#sheet-qty").textContent = 1;
    $("#sheet-cat").textContent = p.c;
    $("#sheet-name").textContent = p.n;
    $("#sheet-specs").innerHTML = p.s.map((s) => `<li>${s}</li>`).join("");
    const stage = $("#sheet-stage"), img = $("#sheet-img");
    const verFoto = (src, esFoto) => { img.src = src; img.alt = esFoto ? p.n + ", foto real" : p.n; stage.classList.toggle("is-photo", esFoto); };
    verFoto("assets/img/productos/" + id + ".webp", false);
    const fotos = [["assets/img/productos/" + id + ".webp", false], ...p.f.map((f) => ["assets/img/fotos/" + f, true])];
    $("#sheet-thumbs").innerHTML = fotos.length > 1 ? fotos.map(([src], k) => `<button type="button" aria-pressed="${k === 0}" aria-label="${k ? "Foto real " + k : "Producto"}" data-foto="${k}"><img src="${src}" alt=""></button>`).join("") : "";
    $$("#sheet-thumbs button").forEach((b) => b.addEventListener("click", () => {
      $$("#sheet-thumbs button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      verFoto(...fotos[+b.dataset.foto]);
    }));
    const vs = $("#sheet-variants");
    vs.hidden = !p.v.length;
    $("#sheet-variant-list").innerHTML = p.v.map(([n, pr], k) => `<label><input type="radio" name="variante" value="${n}" ${k ? "" : "checked"}><span>${n} · ${dinero(pr)}</span></label>`).join("");
    actualizarPrecioFicha();
    abrir(sheet, $(".sheet-x", sheet));
  }
  function precioFicha() {
    const p = C[fichaId];
    const v = $("input[name=variante]:checked", sheet);
    return v ? p.v.find((x) => x[0] === v.value)[1] : p.p;
  }
  function actualizarPrecioFicha() { $("#sheet-price").textContent = dinero(precioFicha() * fichaCant); }
  $("#sheet-variant-list").addEventListener("change", actualizarPrecioFicha);
  $$("[data-qty]", sheet).forEach((b) => b.addEventListener("click", () => {
    fichaCant = Math.max(1, fichaCant + +b.dataset.qty);
    $("#sheet-qty").textContent = fichaCant;
    actualizarPrecioFicha();
  }));
  $("#sheet-add").addEventListener("click", () => {
    const v = $("input[name=variante]:checked", sheet);
    agregar(fichaId, v ? v.value : "", fichaCant, $("#sheet-img"));
    cerrar(sheet);
  });
  $$("[data-close]", sheet).forEach((b) => b.addEventListener("click", () => cerrar(sheet)));

  document.addEventListener("click", (ev) => {
    const add = ev.target.closest("[data-add]");
    if (add) {
      const p = C[add.dataset.add];
      if (p && p.v.length) { abrirFicha(add.dataset.add); return; }
      const tile = add.closest(".tile");
      agregar(add.dataset.add, "", 1, tile ? $(".tile-stage img", tile) : $("#show-img"));
      return;
    }
    const open = ev.target.closest("[data-open]");
    if (open) abrirFicha(open.dataset.open);
  });

  /* ---------- Carrito y cuestionario de pedido ---------- */
  const cart = $("#cart"), form = $("#checkout");
  $("#cart-open").addEventListener("click", () => { mostrarPaso(false); abrir(cart, $(".sheet-x", cart)); });
  $$("[data-cart-close]", cart).forEach((b) => b.addEventListener("click", () => cerrar(cart)));
  function mostrarPaso(pedido) {
    $("#cart-items-step").hidden = pedido;
    form.hidden = !pedido;
    $("#cart-title").textContent = pedido ? "Tu pedido" : "Tu carrito";
    if (pedido) $("input[name=entrega]", form).focus();
  }
  $("#cart-next").addEventListener("click", () => mostrarPaso(true));
  $("#cart-back").addEventListener("click", () => mostrarPaso(false));
  form.addEventListener("change", (ev) => {
    if (ev.target.name !== "entrega") return;
    $$("[data-si]", form).forEach((d) => (d.hidden = d.dataset.si !== ev.target.value));
  });
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const err = $("#form-error");
    const falta = !d.entrega ? "Elige cómo quieres recibir tu pedido." : !d.pago ? "Elige cómo vas a pagar." : !(d.nombre || "").trim() ? "Escribe tu nombre." : !carrito.length ? "Tu carrito está vacío." : "";
    err.textContent = falta;
    if (falta) return;
    const lineas = carrito.map((i) => `• ${i.cant} × ${C[i.id].n}${i.v ? " (" + i.v + ")" : ""} — ${dinero(i.precio * i.cant)}`);
    let entrega = d.entrega;
    if (d.entrega === "Delivery en Barinas" && d.zona) entrega += " · " + d.zona;
    if (d.entrega === "Envío nacional") entrega += ` · ${d.agencia}${d.ciudad ? " · " + d.ciudad : ""}${d.cedula ? " · C.I. " + d.cedula : ""}`;
    const texto = ["¡Hola, Tecnoding! 👋 Quiero hacer este pedido:", "", ...lineas, "", `Total: ${dinero(total())}`, `Entrega: ${entrega}`, `Pago: ${d.pago}`, `Nombre: ${d.nombre.trim()}`]
      .concat(d.nota ? [`Nota: ${d.nota}`] : []).join("\n");
    window.open(`https://wa.me/${window.WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    avisar("¡Ding! Te abrimos WhatsApp con tu pedido");
  });
  pintarCarrito();

  /* ---------- Escaparate del inicio ---------- */
  const lista = window.ESCAPARATE || [];
  const nombres = $$(".show-list button");
  const showImg = $("#show-img"), stage = $("#show-stage"), barraShow = $("#show-bar");
  let actual = 0, relojShow, progreso;
  function mostrar(k, usuario) {
    if (k === actual && !usuario) return;
    const id = lista[k], p = C[id];
    if (!p) return;
    actual = k;
    nombres.forEach((b, j) => b.setAttribute("aria-pressed", String(j === k)));
    const poner = () => {
      showImg.src = "assets/img/productos/" + id + ".webp";
      showImg.alt = p.n;
      $("#show-name").textContent = p.n;
      $("#show-spec").textContent = p.s.slice(0, 2).join(" · ");
      $("#show-price").textContent = (p.v.length ? "desde " : "") + dinero(p.v.length ? Math.min(...p.v.map((v) => v[1])) : p.p);
      $("#show-add").dataset.add = id;
      $("#show-more").dataset.open = id;
      stage.style.setProperty("--disco", p.d);
    };
    if (conGsap()) {
      gsap.timeline()
        .to(showImg, { rotationY: -70, x: -60, opacity: 0, duration: 0.35, ease: "power2.in" })
        .to("#show-copy > *", { y: -12, opacity: 0, duration: 0.2, stagger: 0.03 }, 0)
        .add(poner)
        .fromTo(showImg, { rotationY: 70, x: 60, opacity: 0, scale: 0.86 }, { rotationY: 0, x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" })
        .fromTo("#show-copy > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out" }, "-=0.55");
    } else poner();
    reiniciarReloj();
  }
  function reiniciarReloj() {
    clearTimeout(relojShow);
    if (quieto) return;
    if (window.gsap) {
      if (progreso) progreso.kill();
      progreso = gsap.fromTo(barraShow, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none" });
    }
    relojShow = setTimeout(() => mostrar((actual + 1) % lista.length), 6000);
  }
  nombres.forEach((b, k) => b.addEventListener("click", () => mostrar(k, true)));
  $("#escaparate").addEventListener("mouseenter", () => { clearTimeout(relojShow); if (progreso) progreso.pause(); });
  $("#escaparate").addEventListener("mouseleave", () => { if (progreso) progreso.resume(); relojShow = setTimeout(() => mostrar((actual + 1) % lista.length), 3000); });
  $("#escaparate").addEventListener("focusin", () => { clearTimeout(relojShow); if (progreso) progreso.pause(); });

  /* ---------- Inclinación 3D con el puntero ---------- */
  function inclinar(zona, objeto, fuerza = 12) {
    if (quieto || !matchMedia("(hover:hover)").matches) return;
    zona.addEventListener("pointermove", (ev) => {
      const r = zona.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      if (window.gsap) gsap.to(objeto, { rotationY: x * fuerza * 2, rotationX: -y * fuerza * 2, transformPerspective: 900, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    });
    zona.addEventListener("pointerleave", () => window.gsap && gsap.to(objeto, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1,.5)" }));
  }

  /* ---------- Animaciones 3D al hacer scroll ---------- */
  function animarScroll() {
    if (!conGsap() || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // entrada del escaparate
    gsap.from(".show-disc", { scale: 0.4, opacity: 0, duration: 1.2, ease: "expo.out" });
    gsap.from(showImg, { rotationY: -90, z: -400, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.15 });
    gsap.from([".show-list li", "#show-copy > *"], { y: 24, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", delay: 0.3 });
    // al bajar, el producto del inicio gira y se aleja en profundidad
    gsap.to(".show-stage", { rotationX: 28, rotationY: -18, z: -180, y: 90, opacity: 0.35, ease: "none",
      scrollTrigger: { trigger: ".show", start: "top top", end: "bottom top", scrub: 0.6 } });

    // riel de categorías
    gsap.from(".rail-item", { y: 40, rotationX: -50, opacity: 0, transformPerspective: 600, duration: 0.8, stagger: 0.05, ease: "back.out(1.6)",
      scrollTrigger: { trigger: ".rail", start: "top 85%", once: true } });

    // títulos de sección
    $$(".cat-head").forEach((h) => gsap.from(h.children, { y: 32, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 82%", once: true } }));

    // mosaico: cada producto entra girando en 3D desde abajo
    ScrollTrigger.batch(".tile", {
      start: "top 92%", once: true,
      onEnter: (els) => gsap.fromTo(els,
        { y: 110, rotationX: 38, rotationY: (i) => (i % 2 ? -14 : 14), z: -160, opacity: 0, transformPerspective: 1100, transformOrigin: "50% 100%" },
        { y: 0, rotationX: 0, rotationY: 0, z: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "expo.out", clearProps: "transform" }),
    });
    // y mientras se desliza, la foto del producto rota sobre sí misma
    $$(".tile-stage img").forEach((img, i) => gsap.fromTo(img, { rotationY: i % 2 ? -22 : 22, y: 18 }, { rotationY: i % 2 ? 22 : -22, y: -18, ease: "none",
      scrollTrigger: { trigger: img.closest(".tile"), start: "top bottom", end: "bottom top", scrub: 1 } }));

    // cómo comprar: los tiles crecen en orden
    gsap.from(".step-tile", { scaleY: 0.2, transformOrigin: "50% 100%", opacity: 0, duration: 1, stagger: 0.15, ease: "expo.out",
      scrollTrigger: { trigger: ".steps", start: "top 80%", once: true } });
    gsap.from(".step-tile img", { rotationY: 120, scale: 0.5, opacity: 0, duration: 1.2, stagger: 0.15, ease: "back.out(1.4)", delay: 0.3,
      scrollTrigger: { trigger: ".steps", start: "top 80%", once: true } });
    gsap.from(".how-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".how", start: "top 80%", once: true } });

    // cierre: el producto vuelve rotando con el scroll
    gsap.fromTo(".close-img img", { rotationY: -40, rotationX: 12, scale: 0.8, transformPerspective: 1200 }, { rotationY: 8, rotationX: 0, scale: 1, ease: "none",
      scrollTrigger: { trigger: ".close", start: "top bottom", end: "center center", scrub: 1 } });
    gsap.from(".close-copy > *", { y: 28, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".close", start: "top 70%", once: true } });

    // pie: la marca se arma
    gsap.from(".foot-iso", { rotation: -90, scale: 0.4, opacity: 0, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: ".footer", start: "top 85%", once: true } });
    gsap.from(".foot-mark .lockup", { x: -40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.15, scrollTrigger: { trigger: ".footer", start: "top 85%", once: true } });

    $$(".tile-stage").forEach((t) => inclinar(t, t, 7));
  }

  inclinar(stage, showImg, 14);
  const iniciar = () => { animarScroll(); reiniciarReloj(); };
  if (window.gsap) iniciar(); else addEventListener("load", iniciar);
})();

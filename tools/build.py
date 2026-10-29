"""Genera index.html (español) y en/index.html (inglés) desde tools/contenido.py.

Uso:  python tools/build.py

Solo incluye los reels que existen en assets/video, así que después de añadir
vídeos basta con:  python tools/comprimir-videos.py  y  python tools/build.py
"""
import json
import math
from html import escape
from pathlib import Path
from urllib.parse import quote

import contenido as C

ROOT = Path(__file__).resolve().parent.parent
VERSION = "8"  # súbelo para forzar que los navegadores recarguen CSS/JS


def e(s):
    return escape(str(s), quote=True)


def k(n):
    """15000 -> 15k, 1200000 -> 1.2M"""
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}".rstrip("0").rstrip(".") + "M"
    return f"{round(n / 1000)}k"


def videos(slug):
    out = []
    for i in range(1, 10):
        if (ROOT / "assets" / "video" / f"{slug}-{i}.mp4").exists():
            out.append(f"{slug}-{i}")
    return out


ISOTIPO = (
    '<svg class="{cls}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">'
    '<defs><mask id="m-{id}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">'
    '<rect width="120" height="120" fill="#fff"/>'
    '<path d="M40 86 L55 52 L70 86" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></mask>'
    '<linearGradient id="g-{id}" x1="26" y1="100" x2="100" y2="20" gradientUnits="userSpaceOnUse">'
    '<stop offset="0" stop-color="{c1}"/><stop offset=".55" stop-color="{c2}"/><stop offset="1" stop-color="{c3}"/></linearGradient></defs>'
    '<path mask="url(#m-{id})" d="M36 22 C31 19 26 22 26 28 V92 C26 98 31 101 36 98 L96 65 C101 62 101 58 96 55 Z" fill="url(#g-{id})"/>'
    '{clip}</svg>'
)


def isotipo(id_, cls, colores=("#2F6BFF", "#19D3C5", "#3CE07A"), clip=True):
    c = '<path d="M47 74 H63" stroke="#FFD23F" stroke-width="6" stroke-linecap="round"/>' if clip else ""
    return ISOTIPO.format(id=id_, cls=cls, c1=colores[0], c2=colores[1], c3=colores[2], clip=c)


ICONOS = {
    "whatsapp": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3Z"/></svg>',
    "instagram": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 3.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1C5.3 20 4 18.7 3.9 16c-.1-1-.1-1.3-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1ZM12 2C9.3 2 8.9 2 7.9 2.1 4.3 2.2 2.2 4.3 2.1 7.9 2 8.9 2 9.3 2 12s0 3.1.1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15.1 2 14.7 2 12 2Z"/></svg>',
    "tiktok": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.6 2h-3.3v13.6a2.9 2.9 0 1 1-2-2.8V9.4a6.3 6.3 0 1 0 5.3 6.2V8.7a8 8 0 0 0 4.6 1.5V6.8a4.7 4.7 0 0 1-4.6-4.8Z"/></svg>',
    "sonido": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="on" fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z"/><path class="off" fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3Zm17.6 0L19.2 7.6 17 9.8l-2.2-2.2L13.4 9l2.2 2.2-2.2 2.2 1.4 1.4 2.2-2.2 2.2 2.2 1.4-1.4-2.2-2.2L20.6 9Z"/></svg>',
    "flecha": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11 4h2v12.2l5.3-5.3 1.4 1.4L12 20l-7.7-7.7 1.4-1.4 5.3 5.3V4Z"/></svg>',
    "estrella": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8 2.9-6Z"/></svg>',
}


def phone(clip, alt, t, cls="", lazy=True, base=""):
    """Un móvil con su reel. El vídeo se carga y reproduce solo cuando está a la vista."""
    return f"""
<figure class="phone {cls}" data-phone>
  <div class="phone__screen">
    <video class="phone__video" muted loop playsinline preload="none" poster="{base}assets/poster/{clip}.jpg"
      width="540" height="960" aria-label="{e(alt)}" data-src="{base}assets/video/{clip}.mp4"></video>
    <button class="phone__sound" type="button" data-sound aria-pressed="false"
      data-on="{e(t['sonido_on'])}" data-off="{e(t['sonido_off'])}">
      {ICONOS['sonido']}<span class="sr-only">{e(t['sonido_on'])}</span>
    </button>
  </div>
</figure>"""


def render(lang):
    t = C.T[lang]
    otro = t["otro"]
    en_raiz = lang == "es"
    base = "" if en_raiz else "../"
    url = C.SITE_URL + ("/" if en_raiz else "/en/")
    url_es, url_en = C.SITE_URL + "/", C.SITE_URL + "/en/"
    href_otro = "en/" if en_raiz else "../"
    wa = f"https://wa.me/{C.WHATSAPP}?text={quote(t['wa_saludo'])}"

    # ---------- Trabajos
    bloques, tabs = [], []
    hero_clip = None
    for cat in C.CATEGORIAS:
        clips = videos(cat["slug"])
        if not clips:
            continue
        c = cat[lang]
        if C.HERO_CLIP in clips or not hero_clip:
            hero_clip = C.HERO_CLIP if C.HERO_CLIP in clips else clips[0]
        tabs.append(f'<li><a href="#{cat["slug"]}" data-tab="{cat["slug"]}">{e(c["nombre"])}</a></li>')
        entrega = "".join(f"<li>{e(x)}</li>" for x in c["entrega"])
        phones = "".join(
            phone(clip, f'{t["reel_de"]} {c["nombre"]} {i}', t, cls=f"phone--{i}", base=base)
            for i, clip in enumerate(clips, 1)
        )
        bloques.append(f"""
  <article class="cat" id="{cat['slug']}" data-cat="{cat['slug']}">
    <div class="cat__info" data-reveal>
      <h3 class="cat__name">{e(c['nombre'])}</h3>
      <p class="cat__text">{e(c['texto'])}</p>
      <ul class="cat__list">{entrega}</ul>
    </div>
    <div class="cat__reels" data-count="{len(clips)}">{phones}
    </div>
  </article>""")

    # ---------- Resultados
    max_x = max(r["despues"] / r["antes"] for r in C.RESULTADOS)
    filas = []
    for r in C.RESULTADOS:
        x = r["despues"] / r["antes"]
        ancho = max(6, math.sqrt(x / max_x) * 100)  # raíz: se ven todas, el orden se respeta
        filas.append(f"""
      <li class="bar" style="--w:{ancho:.1f}%">
        <span class="bar__label">{e(r[lang])}</span>
        <span class="bar__track"><span class="bar__fill"></span></span>
        <span class="bar__nums"><span class="bar__antes">{k(r['antes'])}</span> <span aria-hidden="true">›</span><span class="sr-only">{e(t['res_despues'])}</span> <strong class="bar__despues">{k(r['despues'])}</strong></span>
        <span class="bar__x">×{x:.0f} <span class="sr-only">{e(t['res_veces'])}</span></span>
      </li>""")

    resenas = []
    for r in C.RESENAS:
        estrellas = ""
        if r["estrellas"]:
            estrellas = f'<span class="quote__stars" role="img" aria-label="{r["estrellas"]}/5">{ICONOS["estrella"] * r["estrellas"]}</span>'
        trad = f'<span class="quote__trad">{e(t["traducido"])}</span>' if r["original"] != lang else ""
        resenas.append(f"""
      <li class="quote" data-reveal>
        <blockquote><p>{e(r[lang])}</p></blockquote>
        <p class="quote__who">{estrellas}<span>{e(r['quien_' + lang])}</span>{trad}</p>
      </li>""")

    pasos = "".join(
        f'<li class="step" data-reveal><h3 class="step__name">{e(n)}</h3><p>{e(d)}</p></li>' for n, d in t["metodo"]
    )

    def chips(nombre, ops):
        return "".join(
            f'<label class="chip"><input type="radio" name="{nombre}" value="{e(o)}" required><span>{e(o)}</span></label>'
            for o in ops
        )

    herr = "".join(f"<li>{e(h)}</li>" for h in C.HERRAMIENTAS)
    marquee = f'<ul class="marquee__track">{herr}</ul><ul class="marquee__track" aria-hidden="true">{herr}</ul>'

    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": C.SITE_URL + "/#alfredo",
                "name": "Alfredo Navea",
                "alternateName": "Alfredits",
                "jobTitle": "Video editor" if lang == "en" else "Editor de video",
                "description": t["description"],
                "image": C.SITE_URL + "/assets/img/alfredo-chaqueta.webp",
                "url": url,
                "knowsLanguage": ["es", "en"],
                "knowsAbout": ["Video editing", "Short-form video", "Motion graphics", "Sound design",
                               "Real estate video", "Instagram Reels", "TikTok", "YouTube Shorts"],
                "sameAs": [C.INSTAGRAM, C.TIKTOK],
                "worksFor": {"@id": C.SITE_URL + "/#alfredits"},
            },
            {
                "@type": "Organization",
                "@id": C.SITE_URL + "/#alfredits",
                "name": "Alfredits",
                "slogan": "Edits that perform",
                "url": url,
                "logo": {"@type": "ImageObject", "url": C.SITE_URL + "/assets/img/apple-touch-icon.png", "width": 180, "height": 180},
                "image": C.SITE_URL + "/assets/img/og.jpg",
                "description": t["description"],
                "founder": {"@id": C.SITE_URL + "/#alfredo"},
                "contactPoint": {
                    "@type": "ContactPoint", "telephone": "+" + C.WHATSAPP, "contactType": "sales",
                    "availableLanguage": ["Spanish", "English"],
                },
                "areaServed": "Worldwide",
                "knowsAbout": ["Video editing", "Short-form video", "Motion graphics", "AI video",
                               "Real estate marketing video", "Content creator editing", "Brand content"],
                "availableLanguage": ["Spanish", "English"],
                "sameAs": [C.INSTAGRAM, C.TIKTOK],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": t["trabajos_h2"],
                    "itemListElement": [
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": c[lang]["nombre"], "description": c[lang]["texto"]}}
                        for c in C.CATEGORIAS
                    ],
                },
            },
            {
                "@type": "WebSite",
                "@id": C.SITE_URL + "/#web",
                "url": C.SITE_URL + "/",
                "name": "Alfredits",
                "inLanguage": ["es", "en"],
                "publisher": {"@id": C.SITE_URL + "/#alfredits"},
            },
            {
                "@type": "WebPage",
                "@id": url + "#pagina",
                "url": url,
                "name": t["title"],
                "description": t["description"],
                "inLanguage": lang,
                "isPartOf": {"@id": C.SITE_URL + "/#web"},
                "about": {"@id": C.SITE_URL + "/#alfredits"},
                "primaryImageOfPage": C.SITE_URL + "/assets/img/og.jpg",
                "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".hero__title", ".hero__text"]},
                "hasPart": [
                    {
                        "@type": "VideoObject",
                        "name": f'{t["reel_de"]} {c[lang]["nombre"]} {i}',
                        "description": c[lang]["texto"],
                        "thumbnailUrl": f"{C.SITE_URL}/assets/poster/{clip}.jpg",
                        "contentUrl": f"{C.SITE_URL}/assets/video/{clip}.mp4",
                        "uploadDate": "2026-10-29",
                        "creator": {"@id": C.SITE_URL + "/#alfredo"},
                    }
                    for c in C.CATEGORIAS for i, clip in enumerate(videos(c["slug"]), 1)
                ],
            },
        ],
    }

    config = {
        "lang": lang, "key": C.WEB3FORMS_KEY, "wa": C.WHATSAPP,
        "msg": {k_: t[k_] for k_ in ("f_enviando", "f_ok", "f_error", "f_falta", "f_email_mal", "f_wa_intro", "f_asunto", "f_enviar")},
        "labels": {"objetivo": t["f_objetivo"], "duracion": t["f_duracion"], "volumen": t["f_volumen"],
                   "referencia": t["f_ref"], "nombre": t["f_nombre"], "email": t["f_email"]},
    }

    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(t['title'])}</title>
<meta name="description" content="{e(t['description'])}">
<meta name="author" content="Alfredo Navea">
<meta name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="es" href="{url_es}">
<link rel="alternate" hreflang="en" href="{url_en}">
<link rel="alternate" hreflang="x-default" href="{url_es}">
<meta name="theme-color" content="#0A0A0F">
<meta name="color-scheme" content="dark">
<link rel="icon" href="{base}assets/img/isotipo-color.svg" type="image/svg+xml">
<link rel="icon" href="{base}favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="{base}assets/img/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Alfredits">
<meta property="og:title" content="{e(t['title'])}">
<meta property="og:description" content="{e(t['description'])}">
<meta property="og:url" content="{url}">
<meta property="og:locale" content="{t['locale']}">
<meta property="og:locale:alternate" content="{C.T[otro]['locale']}">
<meta property="og:image" content="{C.SITE_URL}/assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{e(t['og_alt'])}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(t['title'])}">
<meta name="twitter:description" content="{e(t['description'])}">
<meta name="twitter:image" content="{C.SITE_URL}/assets/img/og.jpg">
<link rel="preload" href="{base}assets/fonts/Coolvetica-Rg.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap">
<link rel="stylesheet" href="{base}assets/css/styles.css?v={VERSION}">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#contenido">{e(t['skip'])}</a>

<div class="playhead" aria-hidden="true"><span class="playhead__bar"></span><span class="playhead__head"></span></div>

<header class="nav">
  <a class="nav__logo" href="#inicio" aria-label="Alfredits">
    <img src="{base}assets/img/logo-horizontal-blanco.svg" alt="Alfredits" width="128" height="37">
  </a>
  <nav class="nav__links" aria-label="Principal">
    <a href="#trabajos">{e(t['nav_trabajos'])}</a>
    <a href="#resultados">{e(t['nav_resultados'])}</a>
    <a href="#contacto">{e(t['nav_contacto'])}</a>
  </nav>
  <div class="nav__end">
    <a class="nav__lang" href="{href_otro}" hreflang="{otro}" lang="{otro}" aria-label="{e(t['nav_lang_aria'])}">{t['otro_label']}</a>
    <a class="btn btn--sm" href="#contacto">{e(t['nav_cta'])}</a>
  </div>
</header>

<main id="contenido">

<section class="hero" id="inicio" data-hero>
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="hero__copy">
    <h1 class="hero__title" data-reveal><span>{e(t['h1_a'])}</span> <span>{e(t['h1_b'])}</span></h1>
    <p class="hero__text" data-reveal>{e(t['hero_texto'])}</p>
    <div class="hero__actions" data-reveal>
      <a class="btn" href="#contacto">{e(t['hero_cta'])}</a>
      <a class="link" href="#trabajos">{e(t['hero_link'])} {ICONOS['flecha']}</a>
    </div>
  </div>
  <div class="hero__stage" aria-hidden="false">
    <div class="iso3d" aria-hidden="true" data-iso>
      {''.join(isotipo(f"x{i}", "iso3d__layer", ("#1b3e94", "#0f7d75", "#238446"), clip=False) for i in range(10))}
      {isotipo("front", "iso3d__layer iso3d__front")}
    </div>
    {phone(hero_clip, t['hero_video_alt'], t, cls="phone--hero", base=base) if hero_clip else ''}
  </div>
  <ul class="stats" data-reveal>
    <li><strong>2+</strong><span>{e(t['stat_anos'])}</span></li>
    <li><strong>1.000+</strong><span>{e(t['stat_videos'])}</span></li>
    <li><strong>3M+</strong><span>{e(t['stat_vistas'])}</span></li>
    <li><strong>ES · EN</strong><span>{e(t['stat_idiomas'])}</span></li>
  </ul>
</section>

<section class="work" id="trabajos" aria-labelledby="trabajos-h2">
  <div class="work__head">
    <h2 class="h2" id="trabajos-h2" data-reveal>{e(t['trabajos_h2'])}</h2>
    <p class="work__text" data-reveal>{e(t['trabajos_texto'])}</p>
  </div>
  <nav class="tabs" aria-label="{e(t['nav_trabajos'])}"><ul>{''.join(tabs)}</ul></nav>
  {''.join(bloques)}
</section>

<section class="tools" aria-label="Software">
  <div class="marquee">{marquee}</div>
  <p class="tools__text">{e(t['herr_frase'])}</p>
</section>

<section class="results" id="resultados" aria-labelledby="res-h2">
  <div class="results__chart">
    <h2 class="h2" id="res-h2" data-reveal>{e(t['res_h2'])}</h2>
    <p class="results__text" data-reveal>{e(t['res_texto'])}</p>
    <ol class="bars" data-bars>{''.join(filas)}
    </ol>
  </div>
  <div class="results__quotes">
    <h3 class="sr-only">{e(t['res_resenas_h3'])}</h3>
    <ul class="quotes">{''.join(resenas)}
    </ul>
  </div>
</section>

<section class="method" aria-labelledby="metodo-h2">
  <h2 class="h2 method__title" id="metodo-h2" data-reveal>{e(t['metodo_h2'])}</h2>
  <ol class="steps">{pasos}</ol>
</section>

<section class="contact" id="contacto" aria-labelledby="contacto-h2">
  <div class="contact__intro">
    <h2 class="h2" id="contacto-h2" data-reveal>{e(t['contacto_h2'])}</h2>
    <p class="contact__text" data-reveal>{e(t['contacto_texto'])}</p>
    <figure class="contact__photo" data-reveal>
      <img src="{base}assets/img/alfredo-chaqueta.webp" alt="Alfredo Navea" width="615" height="912" loading="lazy" decoding="async">
    </figure>
    <p class="contact__direct">{e(t['contacto_directo'])}</p>
    <ul class="socials">
      <li><a href="{wa}" target="_blank" rel="noopener">{ICONOS['whatsapp']}<span>WhatsApp<small>{C.WHATSAPP_DISPLAY}</small></span></a></li>
      <li><a href="{C.INSTAGRAM}" target="_blank" rel="noopener me">{ICONOS['instagram']}<span>Instagram<small>{C.INSTAGRAM_HANDLE}</small></span></a></li>
      <li><a href="{C.TIKTOK}" target="_blank" rel="noopener me">{ICONOS['tiktok']}<span>TikTok<small>{C.TIKTOK_HANDLE}</small></span></a></li>
    </ul>
  </div>

  <form class="form" id="plan" novalidate data-form>
    <fieldset class="field">
      <legend>{e(t['f_objetivo'])}</legend>
      <div class="chips">{chips('objetivo', t['f_objetivo_ops'])}</div>
    </fieldset>
    <fieldset class="field">
      <legend>{e(t['f_duracion'])}</legend>
      <div class="chips">{chips('duracion', t['f_duracion_ops'])}</div>
    </fieldset>
    <fieldset class="field">
      <legend>{e(t['f_volumen'])}</legend>
      <div class="chips">{chips('volumen', t['f_volumen_ops'])}</div>
    </fieldset>
    <div class="field">
      <label for="f-ref">{e(t['f_ref'])}</label>
      <textarea id="f-ref" name="referencia" rows="2" aria-describedby="f-ref-ayuda"></textarea>
      <p class="field__help" id="f-ref-ayuda">{e(t['f_ref_ayuda'])}</p>
    </div>
    <div class="field field--row">
      <div>
        <label for="f-nombre">{e(t['f_nombre'])}</label>
        <input id="f-nombre" name="nombre" type="text" autocomplete="name">
      </div>
      <div>
        <label for="f-email">{e(t['f_email'])}</label>
        <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="f-email-error">
        <p class="field__error" id="f-email-error" hidden>{e(t['f_email_mal'])}</p>
      </div>
    </div>
    <input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="btn btn--block" type="submit">{e(t['f_enviar'])}</button>
    {'' if C.WEB3FORMS_KEY else f'<p class="form__note">{e(t["f_wa_nota"])}</p>'}
    <p class="form__status" role="status" aria-live="polite"></p>
  </form>
</section>

</main>

<footer class="footer">
  <p class="footer__name" aria-hidden="true">Alfredits</p>
  <div class="footer__row">
    <p class="footer__lema">{e(t['footer_lema'])}</p>
    <ul class="footer__links">
      <li><a href="{wa}" target="_blank" rel="noopener">WhatsApp</a></li>
      <li><a href="{C.INSTAGRAM}" target="_blank" rel="noopener me">Instagram</a></li>
      <li><a href="{C.TIKTOK}" target="_blank" rel="noopener me">TikTok</a></li>
      <li><a href="{href_otro}" hreflang="{otro}" lang="{otro}">{t['otro_nombre']}</a></li>
    </ul>
  </div>
  <div class="footer__legal">
    <p>{e(t['footer_legal'])}</p>
    <a href="#inicio">{e(t['footer_arriba'])}</a>
  </div>
</footer>

<a class="wa-float" href="{wa}" target="_blank" rel="noopener" aria-label="{e(t['wa_flotante'])}">{ICONOS['whatsapp']}</a>

<script>window.ALF={json.dumps(config, ensure_ascii=False)}</script>
<script src="{base}assets/js/main.js?v={VERSION}" defer></script>
</body>
</html>
"""


def main():
    (ROOT / "index.html").write_text(render("es"), encoding="utf-8")
    (ROOT / "en").mkdir(exist_ok=True)
    (ROOT / "en" / "index.html").write_text(render("en"), encoding="utf-8")

    hoy = "2026-10-29"
    (ROOT / "sitemap.xml").write_text(f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>{C.SITE_URL}/</loc><lastmod>{hoy}</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="{C.SITE_URL}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="{C.SITE_URL}/en/"/>
  </url>
  <url>
    <loc>{C.SITE_URL}/en/</loc><lastmod>{hoy}</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="{C.SITE_URL}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="{C.SITE_URL}/en/"/>
  </url>
</urlset>
""", encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {C.SITE_URL}/sitemap.xml\n", encoding="utf-8")

    es = C.T["es"]
    cats = "\n".join(f"- {c['es']['nombre']} / {c['en']['nombre']}: {c['es']['texto']}" for c in C.CATEGORIAS)
    res = "\n".join(f"- {r['es']}: {k(r['antes'])} → {k(r['despues'])} vistas (×{r['despues'] / r['antes']:.0f})" for r in C.RESULTADOS)
    (ROOT / "llms.txt").write_text(f"""# Alfredits

> Alfredits es la marca de Alfredo Navea, editor de video de formato corto (Reels, TikTok, YouTube Shorts). Él y su equipo editan en español e inglés para agentes inmobiliarios, creadores de contenido, empresas y marcas, con un objetivo medible: más ventas, más vistas o más seguidores. Lema: "Edits that perform".

- Experiencia: más de 2 años editando formato corto y más de 1.000 videos editados.
- Mejor resultado: un video de marca pasó de 15k a 1.2M de vistas.
- Idiomas: español e inglés.
- Método: diagnóstico, estrategia, edición y medición. El presupuesto se calcula según el objetivo y el volumen.

## Servicios
{cats}

## Resultados de clientes
{res}

## Contacto
- [Web en español]({C.SITE_URL}/): portfolio y formulario para pedir un plan
- [Website in English]({C.SITE_URL}/en/)
- WhatsApp: {C.WHATSAPP_DISPLAY}
- [Instagram {C.INSTAGRAM_HANDLE}]({C.INSTAGRAM})
- [TikTok {C.TIKTOK_HANDLE}]({C.TIKTOK})
""", encoding="utf-8")
    print("index.html, en/index.html, sitemap.xml, robots.txt y llms.txt generados")
    for cat in C.CATEGORIAS:
        print(f"  {cat['es']['nombre']}: {len(videos(cat['slug']))} reels")


if __name__ == "__main__":
    main()

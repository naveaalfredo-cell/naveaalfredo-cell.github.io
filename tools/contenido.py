"""Todo el texto de la web, en español e inglés.

Para cambiar una frase, edítala aquí y vuelve a ejecutar:  python tools/build.py
"""

# Ajustes del sitio ---------------------------------------------------------
# URL pública final (sin barra al final). Cámbiala por tu usuario de GitHub.
SITE_URL = "https://naveaalfredo-cell.github.io"
# Clave de Web3Forms (web3forms.com). Sin clave, el formulario envía la
# solicitud por WhatsApp en lugar de por correo.
WEB3FORMS_KEY = ""

# Reel que aparece en el móvil de la portada.
HERO_CLIP = "inmobiliaria-3"

WHATSAPP = "584245738444"
WHATSAPP_DISPLAY = "+58 424 573 8444"
INSTAGRAM = "https://www.instagram.com/alfredlno/"
INSTAGRAM_HANDLE = "@alfredlno"
TIKTOK = "https://www.tiktok.com/@alfredo_navea"
TIKTOK_HANDLE = "@alfredo_navea"

# Secciones de trabajos: el orden de esta lista es el orden en la página.
# "slug" es el prefijo de los archivos en assets/video (inmobiliaria-1.mp4…).
CATEGORIAS = [
    {
        "slug": "inmobiliaria",
        "es": {
            "nombre": "Bienes raíces",
            "texto": "Recorridos cinematográficos y reels de marca personal para que tus propiedades se vean al nivel de su precio y te escriban compradores calificados.",
            "entrega": ["Recorridos de propiedades", "Marca personal del agente", "Paquetes mensuales"],
        },
        "en": {
            "nombre": "Real estate",
            "texto": "Cinematic property tours and personal-brand reels that make your listings look worth their price and bring you messages from qualified buyers.",
            "entrega": ["Property tours", "Agent personal brand", "Monthly packages"],
        },
    },
    {
        "slug": "creadores",
        "es": {
            "nombre": "Influencers y creadores",
            "texto": "Ganchos fuertes, subtítulos dinámicos y un estilo que tu audiencia reconoce, entregado cada semana para que tú solo te ocupes de crear.",
            "entrega": ["Edición de alta retención", "Subtítulos dinámicos", "Entregas semanales"],
        },
        "en": {
            "nombre": "Influencers and creators",
            "texto": "Strong hooks, dynamic captions and a style your audience recognises, delivered every week so you can focus on creating.",
            "entrega": ["High-retention editing", "Dynamic captions", "Weekly delivery"],
        },
    },
    {
        "slug": "marcas",
        "es": {
            "nombre": "Empresas y negocios",
            "texto": "Anuncios y contenido de marca con nivel profesional, en versiones para cada red, hechos para vender y no solo para verse bien.",
            "entrega": ["Anuncios para redes", "Contenido de marca", "Versiones por formato"],
        },
        "en": {
            "nombre": "Businesses and brands",
            "texto": "Ads and brand content at a professional level, cut for every platform, made to sell and not just to look good.",
            "entrega": ["Social ads", "Brand content", "A version for every format"],
        },
    },
    {
        "slug": "motion",
        "es": {
            "nombre": "Motion graphics",
            "texto": "Tipografía cinética, animación y piezas creadas con IA para explicar, lanzar o anunciar un producto y destacar en el feed.",
            "entrega": ["Tipografía cinética", "Contenido con IA", "Lanzamientos y anuncios"],
        },
        "en": {
            "nombre": "Motion graphics",
            "texto": "Kinetic type, animation and AI-made pieces to explain, launch or announce a product and stand out in the feed.",
            "entrega": ["Kinetic typography", "AI-generated content", "Launches and ads"],
        },
    },
]

# Resultados: vistas medias de la cuenta antes → vistas del reel editado.
RESULTADOS = [
    {"antes": 15_000, "despues": 1_200_000, "es": "Contenido de marca", "en": "Brand content"},
    {"antes": 10_000, "despues": 545_000, "es": "Contenido cinematográfico con IA", "en": "Cinematic AI content"},
    {"antes": 8_000, "despues": 410_000, "es": "Contenido de marca", "en": "Brand content"},
    {"antes": 10_000, "despues": 245_000, "es": "Contenido cinematográfico con IA", "en": "Cinematic AI content"},
    {"antes": 10_000, "despues": 225_000, "es": "Contenido de marca", "en": "Brand content"},
    {"antes": 10_000, "despues": 205_000, "es": "Creador de contenido", "en": "Content creator"},
    {"antes": 5_000, "despues": 195_000, "es": "Contenido de marca", "en": "Brand content"},
    {"antes": 15_000, "despues": 130_000, "es": "Bienes raíces", "en": "Real estate"},
]

# Reseñas. "original" es el idioma en que la escribió el cliente.
RESENAS = [
    {
        "original": "en", "estrellas": 5,
        "es": "El trabajo de Alfredo es fantástico. Tiene muy buen ojo para crear reels que enganchan. Es el número uno en mi lista de editores para contratar.",
        "en": "Alfredo's work is fantastic. He has a great eye for creating engaging social media Reels. He is number one in my designers-to-contract list.",
        "quien_es": "Cliente en Upwork · Edición de reels para Instagram",
        "quien_en": "Upwork client · Instagram Reels editing",
    },
    {
        "original": "es", "estrellas": 0,
        "es": "Súper todos, Alfredo, me gustaron mucho. Siento que se logró lo que buscábamos. ¡Muchas gracias!",
        "en": "Great work on all of them, Alfredo, I really liked them. I feel we achieved what we were looking for. Thank you so much!",
        "quien_es": "Mateo Creaser León · por WhatsApp",
        "quien_en": "Mateo Creaser León · via WhatsApp",
    },
    {
        "original": "en", "estrellas": 5,
        "es": "¡Me encantó trabajar con Alfredo armando varios videos UGC! Volvería a trabajar con él.",
        "en": "Loved working with Alfredo on bringing together a few UGC videos! Would work with him again.",
        "quien_es": "Cliente en Upwork · Videos UGC para creadores",
        "quien_en": "Upwork client · UGC and creator videos",
    },
    {
        "original": "es", "estrellas": 0,
        "es": "¿Nuevo editor? Una locura. Aprobados todos. 10/10.",
        "en": "New editor? Insane. All approved. 10/10.",
        "quien_es": "Facundo · por WhatsApp",
        "quien_en": "Facundo · via WhatsApp",
    },
    {
        "original": "es", "estrellas": 0,
        "es": "Alfredo, la verdad te agradezco tu trabajo. Nos ha gustado mucho, y a los clientes igual. Mil gracias por tu disposición y tu trabajo en serio.",
        "en": "Alfredo, I truly appreciate your work. We loved it, and so did our clients. Thank you for your willingness and your serious work.",
        "quien_es": "Mateo Creaser León · por WhatsApp",
        "quien_en": "Mateo Creaser León · via WhatsApp",
    },
    {
        "original": "en", "estrellas": 5,
        "es": "¡Trabajar con Alfredo siempre es un gusto! Gracias por tu esfuerzo.",
        "en": "Working with Alfredo is always a blast! Thank you for your hard work!",
        "quien_es": "Lull · Videos UGC en Upwork",
        "quien_en": "Lull · UGC videos on Upwork",
    },
]

HERRAMIENTAS = [
    "Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "Photoshop",
    "ElevenLabs", "Kling AI", "Veo 3", "Nano Banana Pro", "Magnific",
    "Seedance", "ChatGPT", "Gemini", "HeyGen",
]

T = {
    "es": {
        "lang": "es", "locale": "es_ES", "otro": "en", "otro_label": "EN", "otro_nombre": "English",
        "title": "Alfredits · Editor de reels que venden | Alfredo Navea",
        "description": "Alfredo Navea (Alfredits), editor de reels, TikToks y shorts en español e inglés para bienes raíces, creadores y marcas. Más ventas, vistas y seguidores.",
        "og_alt": "Alfredits, editor de reels: edits that perform",
        "skip": "Saltar al contenido",
        "nav_trabajos": "Trabajos", "nav_resultados": "Resultados", "nav_contacto": "Contacto",
        "nav_cta": "Pide tu plan",
        "nav_lang_aria": "Ver la web en inglés",
        "h1_a": "Editamos videos", "h1_b": "que cumplen objetivos.",
        "hero_texto": "¿Quieres más ventas, más seguidores o más vistas? Soy Alfredo Navea y, junto a mi equipo de editores, convertimos tu contenido en reels que lo consiguen, en español y en inglés. Tú nos dices el objetivo; nosotros armamos el plan, el presupuesto y la edición.",
        "hero_cta": "Cuéntame tu objetivo", "hero_link": "Ver trabajos",
        "stat_anos": "años editando formato corto", "stat_videos": "videos editados",
        "stat_vistas": "vistas sumando solo 8 reels de clientes", "stat_idiomas": "edición en dos idiomas",
        "hero_video_alt": "Reel de bienes raíces editado por Alfredits",
        "trabajos_h2": "Un estilo para cada objetivo",
        "trabajos_texto": "Tres reels por sector. Tócalos para activar el sonido.",
        "sonido_on": "Activar sonido", "sonido_off": "Silenciar",
        "reel_de": "Reel de",
        "herr_frase": "Edito con software profesional y uso IA para entregar más rápido sin bajar la calidad.",
        "res_h2": "Lo que ganan mis clientes",
        "res_texto": "Vistas medias de la cuenta antes de trabajar conmigo y vistas del reel que editamos juntos.",
        "res_antes": "antes", "res_despues": "después", "res_veces": "más vistas",
        "res_resenas_h3": "Lo que dicen",
        "traducido": "Traducido del inglés",
        "metodo_h2": "Primero el problema, después el presupuesto",
        "metodo": [
            ("Diagnóstico", "Me cuentas qué quieres lograr. Reviso tu cuenta, tu audiencia y tus números actuales."),
            ("Estrategia", "Formato, gancho, ritmo y llamado a la acción pensados para ese objetivo."),
            ("Edición", "Retención, motion graphics, subtítulos dinámicos y diseño sonoro."),
            ("Medición", "Revisamos los resultados y ajustamos la siguiente tanda de videos."),
        ],
        "contacto_h2": "Cuéntame qué quieres lograr",
        "contacto_texto": "Responde cuatro preguntas y te propongo un plan y un presupuesto para tu caso.",
        "contacto_directo": "¿Prefieres hablar directo?",
        "f_objetivo": "¿Qué quieres lograr con tu contenido?",
        "f_objetivo_ops": ["Más ventas", "Más vistas", "Más seguidores", "Otro objetivo"],
        "f_duracion": "¿Cuánto duran tus videos?",
        "f_duracion_ops": ["Menos de 30 s", "30 a 60 s", "1 a 3 min", "Aún no lo sé"],
        "f_volumen": "¿Cuántos videos necesitas al mes?",
        "f_volumen_ops": ["1 a 4", "5 a 10", "11 a 20", "Más de 20"],
        "f_ref": "Un video o estilo de edición que te guste",
        "f_ref_ayuda": "Pega un enlace de Instagram, TikTok o YouTube, o descríbelo con tus palabras.",
        "f_nombre": "Tu nombre", "f_email": "Tu correo",
        "f_enviar": "Enviar y recibir mi plan",
        "f_enviando": "Enviando…",
        "f_ok": "¡Listo! Recibí tu solicitud. Te escribo a tu correo con tu plan.",
        "f_error": "No se pudo enviar. Escríbeme por WhatsApp y lo vemos al momento.",
        "f_falta": "Revisa los campos marcados.",
        "f_email_mal": "Escribe un correo válido, por ejemplo nombre@gmail.com.",
        "f_wa_intro": "Hola Alfredo, quiero un plan para mi contenido.",
        "f_wa_nota": "Se abrirá WhatsApp con tus respuestas listas para enviar.",
        "f_asunto": "Nueva solicitud desde la web de Alfredits",
        "wa_saludo": "Hola Alfredo, vi tu web y quiero información.",
        "footer_lema": "Edits that perform",
        "footer_arriba": "Volver arriba",
        "footer_legal": "© 2026 Alfredo Navea · Alfredits",
        "wa_flotante": "Escríbeme por WhatsApp",
    },
    "en": {
        "lang": "en", "locale": "en_US", "otro": "es", "otro_label": "ES", "otro_nombre": "Español",
        "title": "Alfredits · Short-form video editor | Alfredo Navea",
        "description": "Alfredo Navea (Alfredits) edits Reels, TikToks and Shorts in English and Spanish for real estate, creators and brands. More sales, views and followers.",
        "og_alt": "Alfredits, short-form video editor: edits that perform",
        "skip": "Skip to content",
        "nav_trabajos": "Work", "nav_resultados": "Results", "nav_contacto": "Contact",
        "nav_cta": "Get your plan",
        "nav_lang_aria": "Ver la web en español",
        "h1_a": "We edit videos", "h1_b": "that hit your goals.",
        "hero_texto": "Want more sales, more followers or more views? I'm Alfredo Navea, and together with my team of editors we turn your content into reels that get you there, in English and Spanish. You tell us the goal; we build the plan, the quote and the edit.",
        "hero_cta": "Tell me your goal", "hero_link": "See the work",
        "stat_anos": "years editing short-form", "stat_videos": "videos edited",
        "stat_vistas": "views from just 8 client reels", "stat_idiomas": "editing in two languages",
        "hero_video_alt": "Real estate reel edited by Alfredits",
        "trabajos_h2": "A style for every goal",
        "trabajos_texto": "Three reels per industry. Tap one to turn the sound on.",
        "sonido_on": "Turn sound on", "sonido_off": "Mute",
        "reel_de": "Reel:",
        "herr_frase": "I edit with professional software and use AI to deliver faster without lowering the quality.",
        "res_h2": "What my clients gain",
        "res_texto": "Average views on the account before working with me, and views on the reel we edited together.",
        "res_antes": "before", "res_despues": "after", "res_veces": "more views",
        "res_resenas_h3": "What they say",
        "traducido": "Translated from Spanish",
        "metodo_h2": "First the problem, then the quote",
        "metodo": [
            ("Diagnosis", "You tell me what you want to achieve. I review your account, your audience and your current numbers."),
            ("Strategy", "Format, hook, pacing and call to action designed for that goal."),
            ("Editing", "Retention, motion graphics, dynamic captions and sound design."),
            ("Measurement", "We review the results and adjust the next batch of videos."),
        ],
        "contacto_h2": "Tell me what you want to achieve",
        "contacto_texto": "Answer four questions and I'll send you a plan and a quote for your case.",
        "contacto_directo": "Rather talk directly?",
        "f_objetivo": "What do you want your content to achieve?",
        "f_objetivo_ops": ["More sales", "More views", "More followers", "Something else"],
        "f_duracion": "How long are your videos?",
        "f_duracion_ops": ["Under 30 s", "30 to 60 s", "1 to 3 min", "Not sure yet"],
        "f_volumen": "How many videos do you need per month?",
        "f_volumen_ops": ["1 to 4", "5 to 10", "11 to 20", "More than 20"],
        "f_ref": "A video or editing style you like",
        "f_ref_ayuda": "Paste an Instagram, TikTok or YouTube link, or describe it in your own words.",
        "f_nombre": "Your name", "f_email": "Your email",
        "f_enviar": "Send and get my plan",
        "f_enviando": "Sending…",
        "f_ok": "Done! I got your request. I'll email you your plan.",
        "f_error": "It couldn't be sent. Message me on WhatsApp and we'll sort it out right away.",
        "f_falta": "Check the highlighted fields.",
        "f_email_mal": "Enter a valid email, for example name@gmail.com.",
        "f_wa_intro": "Hi Alfredo, I'd like a plan for my content.",
        "f_wa_nota": "WhatsApp will open with your answers ready to send.",
        "f_asunto": "New request from the Alfredits website",
        "wa_saludo": "Hi Alfredo, I saw your website and I'd like some information.",
        "footer_lema": "Edits that perform",
        "footer_arriba": "Back to top",
        "footer_legal": "© 2026 Alfredo Navea · Alfredits",
        "wa_flotante": "Message me on WhatsApp",
    },
}

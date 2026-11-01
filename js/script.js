/* =============================================================
   IGLESIA NUESTRO HOGAR — JAVASCRIPT
   ============================================================= */

/* -------------------------------------------------------------
   EVENTOS — para publicar una actividad, agrega un objeto aquí.
   Ejemplo:
   {
     fecha: '2026-12-12',                       // AAAA-MM-DD
     titulo: 'Celebración de Navidad',
     hora: '18:30 h',
     lugar: 'Vega de Saldías 772, Chillán',
     descripcion: 'Una noche en familia para celebrar a Jesús.',
     imagen: 'assets/web/congregacion.webp'     // opcional
   },
   Los eventos con fecha pasada se ocultan solos.
   ------------------------------------------------------------- */
const EVENTOS = [
];

/* -------------------------------------------------------------
   VIDEOS DE INSTAGRAM — pega aquí el enlace de cada reel.
   (En Instagram: abre el video → ··· → Copiar enlace)
   ------------------------------------------------------------- */
const VIDEOS_IG = [
  'https://www.instagram.com/reel/DfItkkwvvKB/',
  'https://www.instagram.com/reel/De5ZlSNP4_e/',
  'https://www.instagram.com/reel/De3H9z-PrSm/'
];

const WHATSAPP = '56992483272';
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const MESES_C = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

/* Fotos del visor */
const FOTOS = [
  ['assets/web/portada.webp', 'Equipo de alabanza dirigiendo la adoración'],
  ['assets/web/adoracion-luz.webp', 'Congregación adorando con las manos en alto'],
  ['assets/web/congregacion.webp', 'Congregación reunida en un culto de sábado'],
  ['assets/web/adoracion-manos.webp', 'Adoración en el culto principal'],
  ['assets/web/comunidad.webp', 'Comunidad compartiendo después del culto'],
  ['assets/web/bautismo.webp', 'Celebración de aniversario y bautismos'],
  ['assets/web/alabanza-banda.webp', 'Ministerio de alabanza'],
  ['assets/web/banda-escenario.webp', 'Alabanza en vivo'],
  ['assets/web/oracion-personal.webp', 'Un momento de oración personal'],
  ['assets/web/min-jovenes.webp', 'Encuentro de jóvenes'],
  ['assets/web/min-familias.webp', 'Tiempo en familia'],
  ['assets/web/min-mujeres.webp', 'Encuentro de mujeres'],
  ['assets/web/min-oracion.webp', 'Oración en comunidad'],
  ['assets/web/min-servicio.webp', 'Servicio en la comunidad'],
  ['assets/web/min-alabanza.webp', 'Alabanza y comunión']
];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const wa = txt => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
}

/* Próximos sábados a las 18:30 (hora de Chile) */
function proximosSabados(n = 4) {
  const ahora = new Date();
  const out = [];
  const d = new Date(ahora);
  d.setHours(18, 30, 0, 0);
  let diff = (6 - d.getDay() + 7) % 7;
  // Si hoy es sábado y ya pasó el culto (más de 2 h), pasar al siguiente
  if (diff === 0 && ahora.getTime() > d.getTime() + 2 * 3600e3) diff = 7;
  d.setDate(d.getDate() + diff);
  for (let i = 0; i < n; i++) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return out;
}
const fechaLarga = d => `sábado ${d.getDate()} de ${MESES[d.getMonth()]}`;
const fechaCorta = d => `Sáb ${d.getDate()} ${MESES_C[d.getMonth()]}`;
function etiquetaRelativa(d) {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const x = new Date(d); x.setHours(0,0,0,0);
  const dias = Math.round((x - hoy) / 864e5);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  if (dias < 7) return 'Este sábado';
  return 'Próximo sábado';
}

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Navegación: borde al hacer scroll + barra inferior que se esconde */
  const nav = $('#topnav');
  const bottom = $('#bottombar');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle('scrolled', y > 8);
    if (bottom) {
      const bajando = y > lastY && y > 300;
      bottom.classList.toggle('hide', bajando);
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. Menú desplegable */
  const menuBtn = $('#menuBtn');
  const menu = $('#menuDrop');
  if (menuBtn && menu) {
    const cerrar = () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); };
    const abrir = () => { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); };
    menuBtn.addEventListener('click', e => { e.stopPropagation(); menu.hidden ? abrir() : cerrar(); });
    document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { cerrar(); menuBtn.focus(); } });
    $$('a', menu).forEach(a => a.addEventListener('click', cerrar));
  }

  /* 3. Enlace activo según sección visible */
  const secs = $$('main section[id]');
  const links = $$('[data-sec]');
  if ('IntersectionObserver' in window && secs.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        let id = en.target.id;
        if (id === 'momentos') id = 'ministerios';
        if (id === 'eventos') id = 'oracion';
        links.forEach(a => a.classList.toggle('active', a.dataset.sec === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => obs.observe(s));
  }

  /* 4. Aparición suave */
  const rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const o = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); o.unobserve(e.target); }
    }), { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(el => o.observe(el));
  } else rev.forEach(el => el.classList.add('visible'));

  /* 5. Fechas del próximo culto */
  const sabados = proximosSabados(4);
  const prox = sabados[0];
  const nd = $('#nextDate');
  if (nd) nd.textContent = `${etiquetaRelativa(prox)} · ${prox.getDate()} ${MESES_C[prox.getMonth()]} · 18:30 h`;
  const ndl = $('#nextDateLong');
  if (ndl) ndl.textContent = `Próximo culto: ${fechaLarga(prox)}, 18:30 h`;

  /* 6. Planificador de visita → WhatsApp */
  const selCuando = $('#pCuando');
  if (selCuando) {
    sabados.forEach((d, i) => {
      const op = document.createElement('option');
      op.value = fechaLarga(d);
      op.textContent = i === 0 ? `${etiquetaRelativa(d)} · ${d.getDate()} ${MESES_C[d.getMonth()]}` : `${fechaCorta(d)} · 18:30`;
      selCuando.appendChild(op);
    });
  }
  const planner = $('#planner');
  if (planner) {
    planner.addEventListener('submit', e => {
      e.preventDefault();
      const cuando = selCuando ? selCuando.value : 'este sábado';
      const quien = $('#pQuien') ? $('#pQuien').value : '';
      const msg = `¡Hola! Me gustaría visitar Nuestro Hogar el ${cuando} a las 18:30. Vamos ${quien}. ¿Algo que deba saber?`;
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  /* 7. Agregar al calendario (.ics) */
  const icsBtn = $('#icsBtn');
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      const d = prox;
      const p = n => String(n).padStart(2, '0');
      const fecha = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Iglesia Nuestro Hogar//ES', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:culto-${fecha}@iglesianuestrohogar.cl`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;TZID=America/Santiago:${fecha}T183000`,
        `DTEND;TZID=America/Santiago:${fecha}T203000`,
        'RRULE:FREQ=WEEKLY;BYDAY=SA',
        'SUMMARY:Culto principal · Iglesia Nuestro Hogar',
        'LOCATION:Vega de Saldías 772\\, Chillán\\, Chile',
        'DESCRIPTION:Alabanza\\, Palabra y comunión. ¡Hay un lugar para ti!',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: 'culto-nuestro-hogar.ics' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Listo: abre el archivo para agregarlo a tu calendario');
    });
  }

  /* 8. Corazones de ministerios (se recuerdan en este navegador) */
  const guardados = new Set(store.get('nh-favs', []));
  $$('.heart').forEach(b => {
    const id = b.dataset.id;
    const pintar = () => b.setAttribute('aria-pressed', guardados.has(id) ? 'true' : 'false');
    pintar();
    b.addEventListener('click', () => {
      if (guardados.has(id)) { guardados.delete(id); toast('Quitado de tus favoritos'); }
      else { guardados.add(id); toast('¡Guardado! Te esperamos en este ministerio'); }
      store.set('nh-favs', [...guardados]); pintar();
    });
  });

  /* 9. Flechas del carrusel de ministerios */
  const track = $('#minCards');
  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    if (!track) return;
    const card = track.querySelector('.card');
    const paso = card ? card.getBoundingClientRect().width + 16 : 300;
    track.scrollBy({ left: paso * Number(btn.dataset.scroll), behavior: 'smooth' });
  }));

  /* 10. Visor de fotos */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  let idx = 0, ultimoFoco = null;
  const mostrar = i => {
    idx = (i + FOTOS.length) % FOTOS.length;
    lbImg.src = FOTOS[idx][0]; lbImg.alt = FOTOS[idx][1];
    lbCap.textContent = FOTOS[idx][1];
    lbCount.textContent = `${idx + 1} / ${FOTOS.length}`;
  };
  const abrirLb = i => {
    ultimoFoco = document.activeElement;
    mostrar(i); lb.hidden = false; document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  };
  const cerrarLb = () => { lb.hidden = true; document.body.style.overflow = ''; ultimoFoco && ultimoFoco.focus(); };
  if (lb) {
    $$('.m-tile').forEach(t => t.addEventListener('click', () => abrirLb(Number(t.dataset.i))));
    $('#showAll') && $('#showAll').addEventListener('click', () => abrirLb(0));
    $('#lbClose').addEventListener('click', cerrarLb);
    $('#lbPrev').addEventListener('click', () => mostrar(idx - 1));
    $('#lbNext').addEventListener('click', () => mostrar(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) cerrarLb(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') cerrarLb();
      if (e.key === 'ArrowLeft') mostrar(idx - 1);
      if (e.key === 'ArrowRight') mostrar(idx + 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* 11. Eventos */
  const lista = $('#eventsList'), vacio = $('#eventsEmpty');
  if (lista && vacio) {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const futuros = EVENTOS
      .map(e => ({ ...e, d: new Date(e.fecha + 'T12:00:00') }))
      .filter(e => !isNaN(e.d) && e.d >= hoy)
      .sort((a, b) => a.d - b.d);
    if (!futuros.length) { vacio.hidden = false; lista.hidden = true; }
    else {
      const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
      lista.innerHTML = futuros.map(e => `
        <article class="ev">
          <div class="ev-photo">
            <img src="${esc(e.imagen || 'assets/web/congregacion.webp')}" alt="${esc(e.titulo)}" loading="lazy">
            <span class="ev-date"><b>${e.d.getDate()}</b><small>${MESES_C[e.d.getMonth()]}</small></span>
          </div>
          <div class="ev-body">
            <h3>${esc(e.titulo)}</h3>
            <p>${esc(e.hora || 'Horario por confirmar')} · ${esc(e.lugar || 'Vega de Saldías 772, Chillán')}</p>
            <p>${esc(e.descripcion)}</p>
            <a class="card-link" target="_blank" rel="noopener" href="${wa('Hola, quiero más información sobre: ' + e.titulo)}">Más información</a>
          </div>
        </article>`).join('');
    }
  }

  /* 12. Pedido de oración */
  const form = $('#formOracion');
  if (form) {
    const err = $('#formErr'), ok = $('#formOk'), okTxt = $('#formOkTxt');
    const marcar = (el, on) => el.closest('.field').classList.toggle('error', on);
    $$('input, textarea', form).forEach(el => el.addEventListener('input', () => { marcar(el, false); err.hidden = true; }));

    form.addEventListener('submit', e => {
      const nombre = $('#nombre'), contacto = $('#contactoOracion'), motivo = $('#motivo');
      const errores = [];
      [nombre, contacto, motivo].forEach(el => marcar(el, false));

      if (nombre.value.trim().length < 2) { marcar(nombre, true); errores.push('tu nombre'); }
      const v = contacto.value.trim();
      const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      const esFono = /^[\d\s()+-]{8,}$/.test(v);
      if (!esCorreo && !esFono) { marcar(contacto, true); errores.push('un teléfono o correo válido'); }
      if (motivo.value.trim().length < 10) { marcar(motivo, true); errores.push('tu motivo (mínimo 10 caracteres)'); }

      if (errores.length) {
        e.preventDefault();
        err.textContent = 'Por favor completa ' + errores.join(', ') + '.';
        err.hidden = false;
        const primero = form.querySelector('.field.error input, .field.error textarea');
        primero && primero.focus();
        return;
      }

      // Sin servicio de correo configurado: se envía por WhatsApp
      const action = form.getAttribute('action');
      if (!action || action === '#') {
        e.preventDefault();
        const conf = $('#confidencial').checked;
        const msg = `🙏 Pedido de oración${conf ? ' (CONFIDENCIAL)' : ''}\n\nNombre: ${nombre.value.trim()}\nContacto: ${v}\n\n${motivo.value.trim()}`;
        window.open(wa(msg), '_blank', 'noopener');
        okTxt.textContent = 'Abrimos WhatsApp con tu pedido listo para enviar. Oraremos por ti.';
        ok.hidden = false;
        form.reset();
      }
    });
  }

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 14. Carrusel de fotos del inicio */
  const slider = $('#heroSlider');
  if (slider) {
    const slides = $$('.slide', slider);
    const dots = $$('.slide-dots button', slider);
    const cap = $('#slideCap');
    let actual = 0, timer = null;
    const ir = i => {
      actual = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-on', k === actual));
      dots.forEach((d, k) => d.setAttribute('aria-selected', k === actual ? 'true' : 'false'));
      if (cap) cap.textContent = slides[actual].dataset.cap || '';
    };
    const iniciar = () => { if (!sinMovimiento) { clearInterval(timer); timer = setInterval(() => ir(actual + 1), 5500); } };
    dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); iniciar(); }));
    // Precarga las fotos siguientes para que el cambio sea suave
    slides.forEach(s => { s.loading = 'eager'; });
    let x0 = null;
    slider.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); iniciar(); }
      x0 = null;
    });
    document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : iniciar());
    iniciar();
  }

  /* 15. Cinta de fotos infinita (duplica las fotos para que no se corte) */
  const cinta = $('#marquee');
  if (cinta) {
    $$('img', cinta).forEach(img => {
      const c = img.cloneNode(true);
      c.alt = ''; c.setAttribute('aria-hidden', 'true');
      cinta.appendChild(c);
    });
  }

  /* 16. Efecto de profundidad en los banners */
  const para = $$('.parallax');
  if (para.length && !sinMovimiento) {
    let pend = false;
    const mover = () => {
      const vh = window.innerHeight;
      para.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
        img.style.transform = `translate3d(0, ${(p * -12).toFixed(2)}%, 0)`;
      });
      pend = false;
    };
    window.addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(mover); } }, { passive: true });
    mover();
  }

  /* 17. Videos de Instagram (se cargan cuando la sección se acerca a la pantalla) */
  const igGrid = $('#igGrid');
  if (igGrid) {
    const codigos = VIDEOS_IG
      .map(u => (String(u).match(/instagram\.com\/(?:[^/]+\/)?(reel|p|tv)\/([A-Za-z0-9_-]+)/) || []))
      .filter(m => m[2]);
    igGrid.innerHTML = codigos.map(([, tipo, cod], i) => `
      <div class="ig-card reveal${i ? ' d' + i : ''}" data-src="https://www.instagram.com/${tipo === 'p' ? 'p' : 'reel'}/${cod}/embed/">
        <div class="ig-loading"><svg class="ic" aria-hidden="true"><use href="#i-instagram"/></svg><span>Cargando video…</span></div>
      </div>`).join('');
    const cargar = card => {
      if (card.dataset.ok) return;
      card.dataset.ok = '1';
      const f = document.createElement('iframe');
      f.src = card.dataset.src;
      f.title = 'Video de Instagram de Iglesia Nuestro Hogar';
      f.loading = 'lazy';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; clipboard-write';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('scrolling', 'no');
      f.addEventListener('load', () => card.classList.add('loaded'));
      card.appendChild(f);
    };
    const cards = $$('.ig-card', igGrid);
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { cargar(e.target); e.target.classList.add('visible'); o.unobserve(e.target); }
      }), { rootMargin: '400px 300px' });
      cards.forEach(c => o.observe(c));
    } else cards.forEach(cargar);
  }

  /* 13. Año actual */
  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();
});

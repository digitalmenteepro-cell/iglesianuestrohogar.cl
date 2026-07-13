/* ============================================================
   IGLESIA NUESTRO HOGAR — JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. NAVBAR — fondo sólido al hacer scroll
     ========================================================== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const alScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();
  }

  /* ==========================================================
     2. MENÚ MÓVIL
     ========================================================== */
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle && navLinks && navOverlay) {

    const abrirMenu = () => {
      navLinks.classList.add('open');
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      navOverlay.hidden = false;
      requestAnimationFrame(() => navOverlay.classList.add('show'));
      document.body.style.overflow = 'hidden';
    };

    const cerrarMenu = () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      navOverlay.classList.remove('show');
      setTimeout(() => { navOverlay.hidden = true; }, 300);
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? cerrarMenu() : abrirMenu();
    });

    navOverlay.addEventListener('click', cerrarMenu);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) cerrarMenu();
    });

    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
  }

  /* ==========================================================
     3. ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE
     ========================================================== */
  const secciones = document.querySelectorAll('main section[id]');
  const enlaces   = document.querySelectorAll('.nav-link');

  if (secciones.length && enlaces.length) {
    const obsNav = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) {
          enlaces.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secciones.forEach(s => obsNav.observe(s));
  }

  /* ==========================================================
     4. ANIMACIONES AL APARECER (.reveal)
     ========================================================== */
  const elementos = document.querySelectorAll('.reveal');
  if (elementos.length) {
    const obsReveal = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obsReveal.unobserve(e.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(el => obsReveal.observe(el));
  }

  /* ==========================================================
     5. FORMULARIO DE PEDIDO DE ORACIÓN — validación
     ========================================================== */
  const form = document.getElementById('formOracion');

  if (form) {
    const mensajeOk = document.getElementById('formOk');

    const mostrarError = (campo, texto) => {
      campo.classList.add('error');
      const aviso = campo.parentElement.querySelector('.msj-error');
      if (aviso) {
        aviso.textContent = texto;
        aviso.classList.add('show');
      }
    };

    const limpiarError = campo => {
      campo.classList.remove('error');
      const aviso = campo.parentElement.querySelector('.msj-error');
      if (aviso) aviso.classList.remove('show');
    };

    form.querySelectorAll('input, textarea').forEach(campo => {
      campo.addEventListener('input', () => limpiarError(campo));
    });

    form.addEventListener('submit', e => {
      const nombre   = form.querySelector('#nombre');
      const contacto = form.querySelector('#contacto-oracion');
      const motivo   = form.querySelector('#motivo');

      let valido = true;

      if (nombre.value.trim().length < 3) {
        mostrarError(nombre, 'Escribe tu nombre (mínimo 3 caracteres).');
        valido = false;
      }

      const valor    = contacto.value.trim();
      const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
      const esFono   = /^[\d\s()+-]{8,}$/.test(valor);

      if (!esCorreo && !esFono) {
        mostrarError(contacto, 'Ingresa un correo válido o un teléfono de al menos 8 dígitos.');
        valido = false;
      }

      if (motivo.value.trim().length < 10) {
        mostrarError(motivo, 'Cuéntanos un poco más (mínimo 10 caracteres).');
        valido = false;
      }

      if (!valido) {
        e.preventDefault();
        const primerError = form.querySelector('.error');
        if (primerError) primerError.focus();
        return;
      }

      /* --------------------------------------------------------
         Mientras el atributo action del formulario siga en "#",
         no se envía nada: solo se muestra un mensaje de prueba.
         Cuando pegues tu URL de FormSubmit en el HTML,
         este bloque deja de actuar y el envío es real.
         -------------------------------------------------------- */
      const action = form.getAttribute('action');
      if (!action || action === '#') {
        e.preventDefault();
        if (mensajeOk) {
          mensajeOk.classList.add('show');
          mensajeOk.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        console.info('[Nuestro Hogar] Formulario validado. Falta configurar el atributo action= con tu servicio de correo.');
      }
    });
  }

  /* ==========================================================
     6. AÑO ACTUAL EN EL PIE DE PÁGINA
     ========================================================== */
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

});

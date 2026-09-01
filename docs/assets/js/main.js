window.addEventListener('load', () => {
  const loader = document.getElementById('intro-loader');

  setTimeout(() => {
    loader?.classList.add('is-hidden');

    setTimeout(() => {
      loader?.remove();
    }, 850);
  }, 3500);
});


const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
const heroSection = document.querySelector('.hero');

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const fireflyField = document.querySelector('.fireflies');

function obtenerHoraMexico() {
  const hora = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date()).find(part => part.type === 'hour');

  return Number(hora?.value ?? 12);
}

function crearParticulas(esDeDia) {
  if (!fireflyField) return;

  fireflyField.innerHTML = '';

  const total = esDeDia ? 15 : 22;

  for (let index = 0; index < total; index += 1) {
    const dot = document.createElement('i');

    dot.className = esDeDia ? 'sun-speck' : 'firefly';
    dot.style.left = `${8 + Math.random() * 88}%`;
    dot.style.top = `${18 + Math.random() * 72}%`;
    dot.style.setProperty('--x', `${-45 + Math.random() * 90}px`);
    dot.style.setProperty('--y', `${-55 + Math.random() * 110}px`);
    dot.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
    dot.style.setProperty('--delay', `${Math.random() * -5}s`);

    fireflyField.appendChild(dot);
  }
}

function aplicarModoDelDia() {
  const hora = obtenerHoraMexico();
  const esDeDia = hora >= 7 && hora < 19;

  document.body.classList.toggle('day-mode', esDeDia);
  document.body.classList.toggle('night-mode', !esDeDia);

  crearParticulas(esDeDia);
}

aplicarModoDelDia();

/* Revisa cada minuto por si la página sigue abierta al cambiar de horario */
setInterval(aplicarModoDelDia, 60000);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const navLinks = [...document.querySelectorAll('.main-nav a')];

const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function actualizarMenuActivo() {
  const yaPasoHero = window.scrollY > (heroSection?.offsetHeight ?? 0) - 120;
  siteHeader?.classList.toggle('is-sticky', yaPasoHero);

  let seccionActual = 'hero';
  let mayorParteVisible = 0;

  sections.forEach(section => {
    const posicion = section.getBoundingClientRect();

    const parteVisible = Math.max(
      0,
      Math.min(posicion.bottom, window.innerHeight) - Math.max(posicion.top, 0)
    );

    if (parteVisible > mayorParteVisible) {
      mayorParteVisible = parteVisible;
      seccionActual = section.id;
    }
  });

  /* Contacto tiene prioridad cuando su tarjeta ya está en pantalla */
  const contacto = document.getElementById('contacto');

  if (contacto) {
    const posicionContacto = contacto.getBoundingClientRect();

    const contactoVisible =
      posicionContacto.top < window.innerHeight * 0.78 &&
      posicionContacto.bottom > 120;

    if (contactoVisible) {
      seccionActual = 'contacto';
    }
  }

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${seccionActual}`
    );
  });
}

window.addEventListener('scroll', actualizarMenuActivo, { passive: true });

/* También define el enlace correcto al cargar la página */
actualizarMenuActivo();
document.getElementById('year').textContent = new Date().getFullYear();

const mensajeWhatsApp =
  'Hola, maestra Andrea. Vi la página de El rincón de las luciérnagas y me gustaría recibir información sobre las clases.';

const numeroWhatsApp = '523321901290';

const esDispositivoMovil =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const enlaceWhatsApp = esDispositivoMovil
  ? `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeWhatsApp)}`
  : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeWhatsApp)}`;

document.querySelectorAll('.whatsapp-link').forEach(enlace => {
  enlace.href = enlaceWhatsApp;
});
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

/* ───────────── Modal de agenda ───────────── */

const bookingModal = document.getElementById('agenda-modal');
const bookingForm = document.getElementById('booking-form');
const bookingClose = document.querySelector('.booking-modal-close');
const bookingOpenButtons = document.querySelectorAll('.open-booking-modal');

const serviceType = document.getElementById('service-type');
const supportType = document.getElementById('support-type');

const regularizationFields = document.getElementById('regularization-fields');
const subjectSelector = document.getElementById('subject-selector');
const regularizationReason = document.getElementById('regularization-reason');

const creativeFields = document.getElementById('creative-fields');
const creativeQuestion = document.getElementById('creative-question');
const creativeInterest = document.getElementById('creative-interest');

const subjectCheckboxes = [
  ...document.querySelectorAll('input[name="materias"]')
];

function abrirModalAgenda(event) {
  event.preventDefault();

  if (!bookingModal?.open) {
    bookingModal.showModal();
    document.body.classList.add('modal-open');
  }
}

function resetearModalAgenda() {
  /* Limpia todos los inputs, selects y textareas */
  bookingForm?.reset();

  /* Oculta nuevamente los campos condicionales */
  regularizationFields.hidden = true;
  subjectSelector.hidden = true;
  creativeFields.hidden = true;

  /* Elimina obligatoriedad de campos condicionales */
  supportType.required = false;
  regularizationReason.required = false;
  creativeInterest.required = false;

  /* Limpia las materias y posibles mensajes de error */
  subjectCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.setCustomValidity('');
  });

  /* Restaura los textos de Arte y Programación */
  creativeQuestion.textContent = '¿Qué le gustaría aprender?';
  creativeInterest.placeholder =
    'Cuéntanos un poco sobre lo que busca...';
}

function cerrarModalAgenda() {
  if (!bookingModal?.open) return;

  bookingModal.classList.add('is-closing');

  setTimeout(() => {
    bookingModal.close();
    bookingModal.classList.remove('is-closing');
    document.body.classList.remove('modal-open');

    /* Deja el formulario listo para comenzar nuevamente */
    resetearModalAgenda();
  }, 240);
}

bookingOpenButtons.forEach(button => {
  button.addEventListener('click', abrirModalAgenda);
});

bookingClose?.addEventListener('click', cerrarModalAgenda);

bookingModal?.addEventListener('click', event => {
  if (event.target === bookingModal) {
    cerrarModalAgenda();
  }
});

bookingModal?.addEventListener('cancel', event => {
  event.preventDefault();
  cerrarModalAgenda();
});

serviceType?.addEventListener('change', () => {
  const servicio = serviceType.value;
  const esRegularizacion = servicio === 'Regularización';
  const esCreativo =
    servicio === 'Arte' || servicio === 'Programación básica';

  regularizationFields.hidden = !esRegularizacion;
  creativeFields.hidden = !esCreativo;

  supportType.required = esRegularizacion;
  regularizationReason.required = false;
  creativeInterest.required = esCreativo;

  if (!esRegularizacion) {
    supportType.value = '';
    subjectSelector.hidden = true;
    regularizationReason.value = '';

    subjectCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.setCustomValidity('');
    });
  }

  if (esCreativo) {
    creativeQuestion.textContent =
      servicio === 'Arte'
        ? '¿Qué le gustaría aprender o crear?'
        : '¿Qué le gustaría aprender de programación?';

    creativeInterest.placeholder =
      servicio === 'Arte'
        ? 'Ej. dibujo, acuarela, pintura o creación de personajes...'
        : 'Ej. lógica, computación o sus primeros proyectos digitales...';
  } else {
    creativeInterest.value = '';
  }
});

supportType?.addEventListener('change', () => {
  const necesitaMaterias =
    supportType.value === 'Materias específicas';

  subjectSelector.hidden = !necesitaMaterias;

  if (!necesitaMaterias) {
    subjectCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.setCustomValidity('');
    });
  }
});

subjectCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    subjectCheckboxes.forEach(item => {
      item.setCustomValidity('');
    });
  });
});

bookingForm?.addEventListener('submit', event => {
  event.preventDefault();

  const edad = document.getElementById('student-age').value;
  const servicio = serviceType.value;
  const tipoApoyo = supportType.value;

  const materias = subjectCheckboxes
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  if (
    servicio === 'Regularización' &&
    tipoApoyo === 'Materias específicas' &&
    materias.length === 0
  ) {
    subjectCheckboxes[0].setCustomValidity(
      'Selecciona al menos una materia.'
    );

    subjectCheckboxes[0].reportValidity();
    return;
  }

  const lineas = [
    '✨ Hola, maestra Andrea. Quiero solicitar información para una clase.',
    '',
    `Edad del estudiante: ${edad} años`,
    `Tipo de clase: ${servicio}`
  ];

  if (servicio === 'Regularización') {
    lineas.push(`Tipo de apoyo: ${tipoApoyo}`);

    if (materias.length > 0) {
      lineas.push(`Materias: ${materias.join(', ')}`);
    }

    const motivo = regularizationReason.value.trim();

    if (motivo) {
      lineas.push(`Motivo de la regularización: ${motivo}`);
    }
  } else {
    lineas.push(
      `Interés principal: ${creativeInterest.value.trim()}`
    );
  }

  lineas.push('', '¿Podría compartirme horarios y disponibilidad?');

  const mensajeAgenda = lineas.join('\n');

  const enlaceAgenda = esDispositivoMovil
    ? `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeAgenda)}`
    : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeAgenda)}`;

  window.open(enlaceAgenda, '_blank', 'noopener,noreferrer');

  cerrarModalAgenda();
});
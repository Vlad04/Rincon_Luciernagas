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

const sections = [...document.querySelectorAll('main section[id], header[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
window.addEventListener('scroll', () => {
  let current = 'inicio';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();

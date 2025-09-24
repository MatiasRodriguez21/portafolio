/* ===== Util: alto del header para offsets ===== */
function getNavOffset() {
  const header = document.getElementById('navbar');
  return header ? header.offsetHeight + 10 : 80; // respiro
}

/* ===== Scroll suave con OFFSET ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const destino = document.querySelector(href);
    if (!destino) return;

    e.preventDefault();
    const offset = getNavOffset();
    const top = destino.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===== Scroll-spy robusto (marca Contact correctamente) ===== */
const menuLinks = [...document.querySelectorAll('header nav ul li a')];
const sectionIds = menuLinks
  .map(a => a.getAttribute('href'))
  .filter(h => h && h.startsWith('#'))
  .map(h => h.slice(1))
  // Solo secciones del menú (evita #home)
  .filter(id => ['about', 'projects', 'contact'].includes(id));

const sections = sectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActive() {
  const offset = getNavOffset();
  // Posición de referencia justo debajo del header
  const pos = window.scrollY + offset + 1;

  // 1) Por defecto, tomamos la primera
  let current = sections.length ? sections[0].id : null;

  // 2) La última sección cuyo top quedó por encima de 'pos'
  for (const sec of sections) {
    if (sec.offsetTop <= pos) current = sec.id;
  }

  // 3) Si estamos (casi) al final de la página => Contact sí o sí
  const atBottom =
    window.innerHeight + window.scrollY >=
    (document.documentElement.scrollHeight - 2);
  if (atBottom && sections.length) {
    current = sections[sections.length - 1].id; // contact
  }

  // 4) Aplicar clase activa
  menuLinks.forEach(l =>
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`)
  );
}

let ticking = false;
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      setActive();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', setActive);
window.addEventListener('load', setActive);

/* ===== Aparición de tarjetas y skills ===== */
const fadeEls = document.querySelectorAll('.project-card, .skills div');
function showOnScroll() {
  fadeEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 100) el.classList.add('visible');
  });
}
window.addEventListener('scroll', showOnScroll, { passive: true });
window.addEventListener('load', showOnScroll);

/* ===== Typing del hero (opcional) ===== */
const typingEl = document.getElementById('typing');
if (typingEl) {
  const frases = [
    'Programador Jr · Estudiante de la Tecnicatura en desarrollo de Software',
    
    
  ];
  let i = 0, j = 0, borrando = false;

  function tick() {
    const texto = frases[i];
    typingEl.textContent = texto.slice(0, j);
    if (!borrando) {
      if (j < texto.length) j++;
      else { borrando = true; setTimeout(tick, 1100); return; }
    } else {
      if (j > 0) j--;
      else { borrando = false; i = (i + 1) % frases.length; }
    }
    setTimeout(tick, borrando ? 35 : 55);
  }
  tick();
}

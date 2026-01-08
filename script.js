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

/* ===== Header scroll effect ===== */
let lastScroll = 0;
const header = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

/* ===== Smooth reveal animations ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar secciones
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

/* ===== Formulario de contacto ===== */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener valores del formulario
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Validación básica
    if (!name || !email || !message) {
      alert('Por favor, completa todos los campos');
      return;
    }
    
    // Crear mailto link
    const subject = encodeURIComponent(`Contacto desde portfolio - ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    const mailtoLink = `mailto:mati.rodriguez1201@gmail.com?subject=${subject}&body=${body}`;
    
    // Abrir cliente de correo
    window.location.href = mailtoLink;
    
    // Mostrar mensaje de confirmación
    const button = contactForm.querySelector('.btn-form');
    const originalText = button.textContent;
    button.textContent = '✓ Mensaje enviado';
    button.style.background = '#48bb78';
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      contactForm.reset();
      button.textContent = originalText;
      button.style.background = '';
    }, 3000);
  });
}

/* ===== Botón Volver Arriba ===== */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===== Barra de Progreso de Scroll ===== */
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  });
}

/* ===== Modo Oscuro/Claro ===== */
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Aplicar tema guardado
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  if (themeToggle) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    themeToggle.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  });
}

/* ===== Filtros de Proyectos ===== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remover clase active de todos los botones
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Agregar clase active al botón clickeado
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      const cardTech = card.getAttribute('data-tech');
      
      if (filterValue === 'all' || cardTech === filterValue) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp .5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== Cursor Personalizado ===== */
const customCursor = document.querySelector('.custom-cursor');
if (customCursor && window.innerWidth > 768) {
  document.body.classList.add('cursor-active');
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animación suave del cursor
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    customCursor.style.left = cursorX + 'px';
    customCursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Efecto hover en elementos interactivos
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      customCursor.classList.remove('hover');
    });
  });
}

/* ===== Animación adicional para fadeInUp ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

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

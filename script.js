// ===== Util: calcular offset de la navbar =====
function getNavOffset() {
  const header = document.getElementById('navbar');
  return header ? header.offsetHeight + 16 : 80; // 16px de respiro
}

// ===== Scroll suave con OFFSET para que no se corte con la navbar =====
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener("click", function (e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute("href"));
    if (!destino) return;

    const offset = getNavOffset();
    const top = destino.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  });
});

// ===== Resaltar link activo en navbar con IntersectionObserver =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("header nav ul li a");

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove("active"));
      const linkActivo = document.querySelector(
        `header nav ul li a[href="#${entry.target.id}"]`
      );
      if (linkActivo) linkActivo.classList.add("active");
    }
  });
}, { threshold: 0.6 }); // activa cuando ~60% de la sección es visible

sections.forEach(section => io.observe(section));

// ===== Fade-in para proyectos y skills =====
const fadeElements = document.querySelectorAll('.project-card, .skills div');

function mostrarElementos() {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', mostrarElementos);
window.addEventListener('load', () => {
  mostrarElementos();
});

// ===== Typing effect en Hero (nuevo texto) =====
(function () {
  const target = document.getElementById('typing');
  if (!target) return;
  const text = "Programador Jr · Estudiante de la Tecnicatura en Desarrollo de Software";
  let i = 0;
  function type() {
    if (i < text.length) {
      target.textContent += text.charAt(i++);
      setTimeout(type, 70);
    }
  }
  window.addEventListener('load', type);
})();

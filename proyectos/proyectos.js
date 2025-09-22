(function(){
  // Ocultar botones si no tienen enlace real
  document.querySelectorAll('.project-cta a').forEach(a => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href === '#') a.style.display = 'none';
  });

  // Lightbox
  const thumbs = Array.from(document.querySelectorAll('.gallery img'));
  const lb = document.querySelector('.lightbox');
  if (!thumbs.length || !lb) return;

  const lbImg  = document.querySelector('.lb-img');
  const btnC   = document.querySelector('.lb-close');
  const btnN   = document.querySelector('.lb-next');
  const btnP   = document.querySelector('.lb-prev');
  let index = 0;

  function open(i){
    index = i;
    lbImg.src = thumbs[index].src;
    lbImg.alt = thumbs[index].alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  function next(){ open((index + 1) % thumbs.length); }
  function prev(){ open((index - 1 + thumbs.length) % thumbs.length); }

  thumbs.forEach((img, i) => img.addEventListener('click', () => open(i)));
  btnC.addEventListener('click', close);
  btnN.addEventListener('click', next);
  btnP.addEventListener('click', prev);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  window.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });
})();

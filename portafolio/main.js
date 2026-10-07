(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // ---------- Íconos (trazos 24×24) ----------
  var ICONS = {
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    cycle: 'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4',
    store: 'M4 10v10h16V10M3 10l2-6h14l2 6zM10 20v-5h4v5',
    bag: 'M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2',
    card: 'M3 6h18v12H3zM3 10h18M7 15h4',
    server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
    box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
    chart: 'M4 20h16M7 16v-4M12 16V7M17 16v-7',
    phone: 'M7 3h10v18H7zM11 18h2',
    spark: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z'
  };

  document.querySelectorAll('[data-icon]').forEach(function (holder) {
    var svg = el('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' });
    el('path', { d: ICONS[holder.getAttribute('data-icon')] }, svg);
    holder.appendChild(svg);
  });

  // ---------- Tema (oscuro por defecto) ----------
  document.getElementById('theme').addEventListener('click', function () {
    var next = (root.dataset.theme || 'dark') === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---------- Título: palabras que entran escalonadas ----------
  var wordIndex = 0;
  document.querySelectorAll('.title .split').forEach(function (line) {
    var words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach(function (w, k) {
      var s = document.createElement('span');
      s.className = 'w';
      s.style.setProperty('--i', wordIndex++);
      s.textContent = w + (k < words.length - 1 ? ' ' : '');
      line.appendChild(s);
    });
    // La palabra que rota entra justo después de la primera línea
    if (line.nextElementSibling && line.nextElementSibling.id === 'rot') {
      var first = line.nextElementSibling.firstElementChild;
      first.classList.add('is-first');
      first.style.setProperty('--i', wordIndex++);
    }
  });

  // ---------- Esquema del hero ----------
  // Dos columnas: canales de venta a la izquierda, operación a la derecha, el negocio al centro.
  var VW = 500, CX = 250, CY = 146, R = 54, W = 154, H = 52, GAP = 10;
  var NODES = [
    { id: 'tienda', side: 'l', label: 'Tienda online', sub: 'pedidos · stock', icon: 'store' },
    { id: 'market', side: 'l', label: 'Marketplaces', sub: 'Mercado Libre', icon: 'bag' },
    { id: 'pagos', side: 'l', label: 'Pagos', sub: 'Mercado Pago', icon: 'card' },
    { id: 'ia', side: 'l', label: 'IA', sub: 'agentes · chat', icon: 'spark' },
    { id: 'erp', side: 'r', label: 'ERP', sub: 'facturación', icon: 'server' },
    { id: 'deposito', side: 'r', label: 'Depósito', sub: 'stock · envíos', icon: 'box' },
    { id: 'datos', side: 'r', label: 'Datos', sub: 'reportes', icon: 'chart' },
    { id: 'apps', side: 'r', label: 'Apps', sub: 'web · móvil', icon: 'phone' }
  ];
  var EVENTS = [
    ['tienda', 'erp', 'Pedido nuevo', 'ERP'],
    ['erp', 'tienda', 'Stock actualizado', 'tienda online'],
    ['market', 'deposito', 'Venta en Mercado Libre', 'depósito'],
    ['pagos', 'erp', 'Pago acreditado', 'ERP'],
    ['erp', 'datos', 'Facturas del día', 'reporte de ventas'],
    ['apps', 'deposito', 'Serial escaneado', 'pedido'],
    ['tienda', 'ia', 'Consulta de cliente', 'IA'],
    ['ia', 'apps', 'Tarea redactada por IA', 'equipo'],
    ['deposito', 'market', 'Envío despachado', 'Mercado Libre'],
    ['erp', 'market', 'Precios actualizados', 'Mercado Libre'],
    ['datos', 'apps', 'Reporte listo', 'panel interno']
  ];

  var svg = document.getElementById('hub-svg');
  var rows = 4, top = CY - (rows * H + (rows - 1) * GAP) / 2;
  var VH = CY * 2 - 8;
  svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);

  // Encabezados de columna
  el('text', { x: 10, y: top - 9, 'class': 'h-col' }, svg).textContent = 'DONDE VENDÉS';
  el('text', { x: VW - 10, y: top - 9, 'class': 'h-col h-col--r' }, svg).textContent = 'CÓMO OPERÁS';

  // Anillos de construcción alrededor del centro
  el('circle', { cx: CX, cy: CY, r: R + 16, 'class': 'c-orbit' }, svg);
  el('circle', { cx: CX, cy: CY, r: R + 32, 'class': 'c-orbit c-orbit--2' }, svg);

  var byId = {};
  var spokes = el('g', {}, svg);
  var count = { l: 0, r: 0 };
  NODES.forEach(function (n, k) {
    var row = count[n.side]++;
    n.cy = top + row * (H + GAP) + H / 2;
    n.left = n.side === 'l' ? 8 : VW - 8 - W;
    // Punto de anclaje en el borde de la caja que mira al centro
    n.ax = n.side === 'l' ? n.left + W : n.left;
    n.ay = n.cy;
    // Punto de llegada sobre el círculo central, abierto en abanico
    var spread = (row - 1.5) * 0.36;
    var ang = n.side === 'l' ? Math.PI - spread : spread;
    n.hx = CX + R * Math.cos(ang);
    n.hy = CY + R * Math.sin(ang);
    var mx = (n.ax + n.hx) / 2;
    n.path = el('path', {
      d: 'M' + n.ax + ' ' + n.ay + ' C' + mx + ' ' + n.ay + ' ' + mx + ' ' + n.hy + ' ' + n.hx + ' ' + n.hy,
      'class': 'spoke draw', style: '--i:' + k
    }, spokes);
    n.len = n.path.getTotalLength();
    n.path.style.setProperty('--len', n.len);
    // Flujo continuo y suave sobre cada conexión
    n.flow = el('path', { d: n.path.getAttribute('d'), 'class': 'flow' + (n.side === 'r' ? ' flow--r' : ''), style: '--i:' + k }, spokes);
    byId[n.id] = n;
  });

  var packets = el('g', {}, svg);

  var core = el('g', { 'class': 'core' }, svg);
  el('circle', { cx: CX, cy: CY, r: R, 'class': 'c-pulse' }, core);
  el('circle', { cx: CX, cy: CY, r: R, 'class': 'c1' }, core);
  el('circle', { cx: CX, cy: CY, r: R - 7, 'class': 'c2' }, core);
  el('text', { x: CX, y: CY + 1 }, core).textContent = 'Tu negocio';
  el('text', { x: CX, y: CY + 17, 'class': 'sub' }, core).textContent = 'sincronizado';

  NODES.forEach(function (n, k) {
    var g = el('g', { 'class': 'hn', style: '--i:' + k, transform: 'translate(' + n.left + ' ' + (n.cy - H / 2) + ')' }, svg);
    el('rect', { width: W, height: H, rx: 10 }, g);
    el('rect', { x: 10, y: 11, width: 30, height: 30, rx: 8, 'class': 'ic-tile' }, g);
    var ic = el('g', { transform: 'translate(15 16) scale(0.84)' }, g);
    el('path', { d: ICONS[n.icon], 'class': 'ic' }, ic);
    el('text', { x: 50, y: 24 }, g).textContent = n.label;
    el('text', { x: 50, y: 39, 'class': 'sub' }, g).textContent = n.sub;
    // Puerto donde entra la conexión
    el('circle', { cx: n.side === 'l' ? W : 0, cy: H / 2, r: 3, 'class': 'port' }, g);
    n.g = g;
  });

  function flash(g) {
    g.classList.add('is-hit');
    setTimeout(function () { g.classList.remove('is-hit'); }, 260);
  }

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // Recorre la curva de un nodo; reverse = del centro hacia el nodo
  function travel(n, reverse, duration, done) {
    var g = el('g', {}, packets);
    el('circle', { r: 8, 'class': 'pk-halo' }, g);
    el('circle', { r: 4, 'class': 'pk' }, g);
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration), e = ease(t);
      var p = n.path.getPointAtLength((reverse ? 1 - e : e) * n.len);
      g.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
      if (t < 1) requestAnimationFrame(step);
      else { if (g.parentNode) g.parentNode.removeChild(g); done(); }
    }
    requestAnimationFrame(step);
  }

  var ticker = document.getElementById('ticker');
  function say(what, where) {
    ticker.classList.add('is-swap');
    setTimeout(function () {
      ticker.textContent = what;
      var i = document.createElement('i'); i.textContent = '→';
      ticker.appendChild(i);
      ticker.appendChild(document.createTextNode(where));
      ticker.classList.remove('is-swap');
    }, 200);
  }

  var running = false, clearTimer = null;
  function run(ev) {
    if (running) return; // un recorrido a la vez
    running = true;
    clearTimeout(clearTimer);
    var a = byId[ev[0]], b = byId[ev[1]];
    // Limpiar restos del recorrido anterior
    NODES.forEach(function (n) { n.g.classList.remove('is-from', 'is-to', 'is-arrive'); n.path.classList.remove('is-on'); });
    while (packets.firstChild) packets.removeChild(packets.firstChild);
    a.g.classList.add('is-from');
    b.g.classList.add('is-to');
    say(ev[2], ev[3]);
    a.path.classList.add('is-on');
    travel(a, false, 1100, function () {
      a.path.classList.remove('is-on');
      b.path.classList.add('is-on');
      flash(core);
      travel(b, true, 1100, function () {
        b.path.classList.remove('is-on');
        b.g.classList.add('is-arrive');
        setTimeout(function () { b.g.classList.remove('is-arrive'); }, 700);
        running = false;
      });
    });
    // Seguro por si el navegador frena los cuadros
    setTimeout(function () { running = false; }, 3200);
    // Apagar el origen y el destino un par de segundos después de la llegada
    clearTimer = setTimeout(function () {
      a.g.classList.remove('is-from');
      b.g.classList.remove('is-to');
    }, 2200 + 1200);
  }
  function randomEvent(from) {
    var pool = from ? EVENTS.filter(function (e) { return e[0] === from; }) : EVENTS;
    if (!pool.length) pool = EVENTS;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ---------- Palabra que rota, sincronizada con el esquema ----------
  var WORDS = [
    ['tienda online', 'tienda'], ['ERP', 'erp'], ['depósito', 'deposito'],
    ['Mercado Libre', 'market'], ['Mercado Pago', 'pagos'], ['equipo', 'apps']
  ];
  var rot = document.getElementById('rot');
  var wIdx = 0;
  function focusNode(id) {
    NODES.forEach(function (n) { n.g.classList.toggle('is-focus', n.id === id); });
  }
  function nextWord() {
    var cur = rot.firstElementChild;
    wIdx = (wIdx + 1) % WORDS.length;
    var pair = WORDS[wIdx];
    cur.classList.remove('is-first', 'is-in');
    cur.classList.add('is-out');
    setTimeout(function () {
      var nw = document.createElement('span');
      nw.className = 'rot__w is-in';
      nw.textContent = pair[0];
      rot.replaceChild(nw, cur);
      run(randomEvent(pair[1]));
    }, 340);
  }

  if (!reduceMotion) {
    var timers = [];
    var startAll = function () {
      if (timers.length) return;
      timers.push(setInterval(nextWord, 4400));
    };
    var stopAll = function () { timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = []; };
    setTimeout(function () { run(randomEvent(WORDS[0][1])); startAll(); }, 1800);
    document.addEventListener('visibilitychange', function () { document.hidden ? stopAll() : startAll(); });
    // Mientras el cursor está sobre el esquema, la rotación automática espera
    svg.addEventListener('pointerenter', stopAll);
    svg.addEventListener('pointerleave', function () { if (!document.hidden) startAll(); });
  }

  // Pasar el cursor por una caja resalta su conexión; un clic dispara un evento desde ahí
  NODES.forEach(function (n) {
    n.g.addEventListener('pointerenter', function () {
      svg.classList.add('is-hovering');
      n.g.classList.add('is-hover');
      n.path.classList.add('is-hover');
      var ev = randomEvent(n.id);
      say(ev[2], ev[3]);
      n.preview = ev;
    });
    n.g.addEventListener('pointerleave', function () {
      svg.classList.remove('is-hovering');
      n.g.classList.remove('is-hover');
      n.path.classList.remove('is-hover');
    });
    n.g.addEventListener('click', function () {
      run(n.preview && n.preview[0] === n.id ? n.preview : randomEvent(n.id));
      n.preview = null;
    });
  });

  // ---------- Servicios: selector con panel (rota solo) ----------
  var svcTabs = document.getElementById('svc-tabs');
  if (svcTabs) {
    var tabs = [].slice.call(svcTabs.querySelectorAll('.tab'));
    var tpanels = [].slice.call(svcTabs.querySelectorAll('.tpanel'));
    var TAB_MS = 6000;
    var current = 0, autoTimer = null, paused = false, inView = false;

    var select = function (idx, focus) {
      if (idx === current && tpanels[idx].classList.contains('is-active')) return;
      tabs.forEach(function (t, k) {
        var on = k === idx;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        tpanels[k].classList.toggle('is-active', on);
        tpanels[k].hidden = !on;
      });
      current = idx;
      if (focus) tabs[idx].focus();
      // En celular, llevar la pestaña activa a la vista dentro de la fila
      var list = svcTabs.querySelector('.tabs__list');
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tabs[idx].offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      if (!reduceMotion && tpanels[idx].animate) {
        var an = tpanels[idx].animate(
          [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 320, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
        );
        setTimeout(function () { try { an.finish(); } catch (e) {} }, 400);
      }
      restartAuto();
    };

    var restartAuto = function () {
      clearTimeout(autoTimer);
      if (reduceMotion || paused || !inView) { svcTabs.classList.remove('is-auto'); return; }
      // Reiniciar la barra de progreso de la pestaña activa
      svcTabs.classList.remove('is-auto');
      void svcTabs.offsetWidth;
      svcTabs.classList.add('is-auto');
      autoTimer = setTimeout(function () { select((current + 1) % tabs.length); }, TAB_MS);
    };

    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k); });
      t.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (k + 1) % tabs.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (k - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });

    // Pausar mientras la persona interactúa con la sección
    var pause = function () { paused = true; svcTabs.classList.add('is-paused'); clearTimeout(autoTimer); };
    var resume = function () { paused = false; svcTabs.classList.remove('is-paused'); restartAuto(); };
    svcTabs.addEventListener('pointerenter', pause);
    svcTabs.addEventListener('pointerleave', resume);
    svcTabs.addEventListener('focusin', pause);
    svcTabs.addEventListener('focusout', function (e) { if (!svcTabs.contains(e.relatedTarget)) resume(); });

    // Rotar solo cuando la sección está a la vista
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        restartAuto();
      }, { threshold: 0.4 }).observe(svcTabs);
    }
    svcTabs.style.setProperty('--tab-ms', TAB_MS + 'ms');
  }

  // ---------- Barra superior: fondo al scrollear y sección activa ----------
  var topBar = document.getElementById('top');
  var onScrollTop = function () { topBar.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScrollTop, { passive: true });
  onScrollTop();

  var spyLinks = [].slice.call(document.querySelectorAll('.menu a[data-spy]'));
  if ('IntersectionObserver' in window && spyLinks.length) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var active = null;
      spyLinks.forEach(function (a) { if (!active && visible[a.getAttribute('data-spy')]) active = a; });
      spyLinks.forEach(function (a) {
        if (a === active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('data-spy'));
      if (sec) spy.observe(sec);
    });
  }

  // ---------- Aparición al scrollear ----------
  var reveal = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveal.forEach(function (n) { io.observe(n); });
  } else {
    reveal.forEach(function (n) { n.classList.add('is-in'); });
  }

  // ---------- Tecnologías: cuántos proyectos usan cada una ----------
  var cards = [].slice.call(document.querySelectorAll('.det, .mini'));
  var groups = [].slice.call(document.querySelectorAll('.details, .minis'));
  // Cómo aparece cada tecnología dentro del texto de los proyectos
  var ALIAS = { 'Google BigQuery': 'BigQuery', 'APIs REST y SOAP': 'SOAP', 'Claude Code': 'Claude' };
  var activeTag = null;
  function clearMatches() {
    if (activeTag) { activeTag.classList.remove('is-on'); activeTag.setAttribute('aria-pressed', 'false'); }
    activeTag = null;
    groups.forEach(function (g) { g.classList.remove('is-filtering'); });
    cards.forEach(function (c) { c.classList.remove('is-match'); });
  }
  document.querySelectorAll('.tlist .tags li').forEach(function (li) {
    var name = li.textContent.trim();
    var key = (ALIAS[name] || name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('(^|[^\\wÀ-ÿ])' + key + '($|[^\\wÀ-ÿ])');
    var matches = cards.filter(function (c) { return re.test(c.textContent); });
    if (!matches.length) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', name + ', usada en ' + matches.length + (matches.length === 1 ? ' proyecto' : ' proyectos'));
    btn.textContent = name;
    var n = document.createElement('span');
    n.className = 'tag__n';
    n.setAttribute('aria-hidden', 'true');
    n.textContent = matches.length;
    btn.appendChild(n);
    li.textContent = '';
    li.appendChild(btn);
    btn.addEventListener('click', function () {
      var same = activeTag === btn;
      clearMatches();
      if (same) return;
      activeTag = btn;
      btn.classList.add('is-on');
      btn.setAttribute('aria-pressed', 'true');
      matches.forEach(function (c) { c.classList.add('is-match'); });
      groups.forEach(function (g) { if (g.querySelector('.is-match')) g.classList.add('is-filtering'); });
      matches[0].scrollIntoView({ block: 'center' });
    });
  });
  // Al salir de Proyectos o con Escape, todo vuelve a la normalidad
  var projects = document.getElementById('proyectos');
  if (projects && 'IntersectionObserver' in window) {
    var seen = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { seen = true; return; }
        if (seen && activeTag) { clearMatches(); seen = false; }
      });
    }).observe(projects);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && activeTag) clearMatches(); });

  // ---------- Cursor: luz que sigue al mouse ----------
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion) {
    // Luz sobre la grilla de puntos del fondo
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    var gx = 0, gy = 0, glowFrame = 0;
    window.addEventListener('pointermove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (glowFrame) return;
      glowFrame = requestAnimationFrame(function () {
        glowFrame = 0;
        glow.style.setProperty('--gx', gx + 'px');
        glow.style.setProperty('--gy', gy + 'px');
        glow.classList.add('is-on');
      });
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); });
    // Mantener sus puntos alineados con la grilla del fondo al scrollear
    var alignGlow = function () { glow.style.backgroundPosition = (-window.scrollX) + 'px ' + (-window.scrollY) + 'px'; };
    window.addEventListener('scroll', alignGlow, { passive: true });
    alignGlow();

    // Reflejo dentro de las tarjetas
    document.querySelectorAll('.det, .mini, .edu__list li, .fig').forEach(function (card) {
      card.classList.add('spot');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // Botones principales: leve atracción hacia el cursor
    document.querySelectorAll('.btn--solid, .top__cta').forEach(function (b) {
      b.classList.add('magnet');
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.translate = (dx * 6).toFixed(1) + 'px ' + (dy * 5).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }

  // ---------- Copiar email ----------
  var copy = document.getElementById('copy');
  var copyStatus = document.getElementById('copy-status');
  var copyTimer = null;
  function copyFeedback(label, message, ok) {
    clearTimeout(copyTimer);
    copy.textContent = label;
    copy.classList.toggle('is-done', ok);
    copyStatus.textContent = message;
    copyTimer = setTimeout(function () {
      copy.textContent = 'Copiar email';
      copy.classList.remove('is-done');
      copyStatus.textContent = '';
    }, ok ? 1800 : 3200);
  }
  // Si el navegador no deja copiar, se selecciona el email para copiarlo a mano
  function copyFallback(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var done = false;
    try { done = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(area);
    if (done) return copyFeedback('Copiado', 'Email copiado al portapapeles', true);
    var range = document.createRange();
    range.selectNodeContents(document.querySelector('.mail__link'));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    copyFeedback('Seleccionado, usá Ctrl+C', 'No se pudo copiar automáticamente. El email quedó seleccionado.', false);
  }
  copy.addEventListener('click', function () {
    var text = copy.getAttribute('data-email');
    if (!navigator.clipboard) return copyFallback(text);
    navigator.clipboard.writeText(text).then(function () {
      copyFeedback('Copiado', 'Email copiado al portapapeles', true);
    }, function () { copyFallback(text); });
  });
})();

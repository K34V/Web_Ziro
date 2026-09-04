/* =========================================================
   ZIRO — Interactions
   Vanilla JS, sin dependencias externas.
   ========================================================= */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1) NAV — menú móvil + sombra al hacer scroll
  --------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');

  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     2) REVEAL ON SCROLL
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     3) HERO — Tilt 3D del mockup con el ratón
  --------------------------------------------------------- */
  const tiltStage = document.getElementById('tiltStage');
  if (tiltStage && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const maxTilt = 14;

    tiltStage.addEventListener('mousemove', (e) => {
      const rect = tiltStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;
      tiltStage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltStage.addEventListener('mouseleave', () => {
      tiltStage.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ---------------------------------------------------------
     4) HERO — Selector de pantallas dentro del mockup
  --------------------------------------------------------- */
  const phoneSwitchBtns = document.querySelectorAll('.phone-switch__btn');
  const screens = document.querySelectorAll('.screen');

  phoneSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;

      phoneSwitchBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      screens.forEach(screen => {
        screen.classList.toggle('is-active', screen.dataset.screen === target);
      });
    });
  });

  // Botón "Probar demo interactiva" → baja a la sección de demo jugable
  const tryDemoBtn = document.getElementById('tryDemoBtn');
  if (tryDemoBtn) {
    tryDemoBtn.addEventListener('click', () => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------------------------------------------------------
     5) ZIRO — Globo de diálogo interactivo
  --------------------------------------------------------- */
  const fox = document.getElementById('foxClickable');
  const bubbleText = document.getElementById('ziroBubbleText');

  const ziroPhrases = [
    '¡Hola! Soy Ziro. Toca mi nariz 🐽',
    'Cada huellita cuenta, no importa qué tan pequeña sea 🐾',
    'Hoy es un buen día para regar tu rosal 🌹',
    '¿Ya hiciste tu examen de conciencia de hoy?',
    'No estás solo en este camino, yo voy contigo.',
    'Una oración corta también es una oración completa.',
    '¡Sigue así! Vas más cerca de tu Primera Comunión.'
  ];
  let ziroIndex = 0;

  function cycleZiroPhrase() {
    ziroIndex = (ziroIndex + 1) % ziroPhrases.length;
    if (bubbleText) {
      bubbleText.textContent = ziroPhrases[ziroIndex];
    }
  }

  if (fox) {
    fox.addEventListener('click', cycleZiroPhrase);
    fox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cycleZiroPhrase();
      }
    });
  }

  // ---- Modelo 3D real (model-viewer) con caída elegante al fox de respaldo ----
  const ziroStage = document.getElementById('ziroStage');
  const modelViewer = document.getElementById('ziroModelViewer');

  if (modelViewer && ziroStage) {
    modelViewer.addEventListener('load', () => {
      // El .glb cargó correctamente: se muestra el modelo 3D y se oculta el fox CSS.
      ziroStage.classList.add('has-model');
      modelViewer.classList.add('is-active');
    });
    modelViewer.addEventListener('error', () => {
      // No hay modelo (o falló la carga): seguimos mostrando el fox CSS de respaldo.
      ziroStage.classList.remove('has-model');
      modelViewer.classList.remove('is-active');
    });
    modelViewer.addEventListener('click', cycleZiroPhrase);
    modelViewer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cycleZiroPhrase();
      }
    });
  }

  /* ---------------------------------------------------------
     6) SELECTOR DE PERFILES — Catequista / Familia
  --------------------------------------------------------- */
  const switcherToggle = document.querySelector('.switcher__toggle');
  const switcherBtns = document.querySelectorAll('.switcher__btn');
  const profileViews = document.querySelectorAll('.profile-view');

  switcherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const profile = btn.dataset.profile;

      switcherBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      profileViews.forEach(view => {
        view.classList.toggle('is-active', view.dataset.view === profile);
      });

      if (switcherToggle) switcherToggle.dataset.active = profile;
    });
  });

  /* ---------------------------------------------------------
     7) CONTADORES ANIMADOS AL HACER SCROLL
  --------------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat__num');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('es-CO') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (statNums.length) {
    if ('IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      statNums.forEach(el => statObserver.observe(el));
    } else {
      statNums.forEach(animateCount);
    }
  }

  /* ---------------------------------------------------------
     8) MINI-JUEGO — "El Árbol Doble"
  --------------------------------------------------------- */
  (function initGame() {
    const stage = document.getElementById('gameStage');
    const sky = document.getElementById('gameSky');
    const startBtn = document.getElementById('gameStart');
    const resetBtn = document.getElementById('gameReset');
    const scoreVal = document.getElementById('scoreVal');
    const livesVal = document.getElementById('livesVal');
    const streakVal = document.getElementById('streakVal');
    const hint = document.getElementById('gameHint');
    const soundToggle = document.getElementById('soundToggle');
    const basketLuz = document.getElementById('basketLuz');
    const basketSombra = document.getElementById('basketSombra');
    const levelBadge = document.getElementById('gameLevel');

    if (!stage || !sky) return;

    const LIGHT_ITEMS = [
      { icon: '🤝', label: 'Perdonar' },
      { icon: '🍞', label: 'Compartir' },
      { icon: '🙏', label: 'Orar' },
      { icon: '❤️', label: 'Ayudar' }
    ];
    const SHADOW_ITEMS = [
      { icon: '🤥', label: 'Mentir' },
      { icon: '⚔️', label: 'Pelear' },
      { icon: '🙈', label: 'Ignorar' },
      { icon: '😠', label: 'Enojarse' }
    ];

    // Niveles progresivos: a más puntaje, cae más rápido, más seguido
    // y aparecen más tentaciones (sombra) que actos de luz.
    const LEVELS = [
      { minScore: 0,   fallSpeed: 2.2, spawnDelay: 1250, shadowRatio: 0.42, label: 'Nivel 1 · Primeros pasos' },
      { minScore: 60,  fallSpeed: 2.8, spawnDelay: 1000, shadowRatio: 0.46, label: 'Nivel 2 · Tomando ritmo' },
      { minScore: 140, fallSpeed: 3.4, spawnDelay: 830,  shadowRatio: 0.50, label: 'Nivel 3 · Atención plena' },
      { minScore: 240, fallSpeed: 4.0, spawnDelay: 690,  shadowRatio: 0.53, label: 'Nivel 4 · Camino exigente' },
      { minScore: 360, fallSpeed: 4.6, spawnDelay: 570,  shadowRatio: 0.56, label: 'Nivel 5 · Corazón firme' }
    ];

    let score = 0;
    let lives = 3;
    let streak = 0;
    let running = false;
    let spawnTimer = null;
    let levelIndex = 0;

    function getLevel() { return LEVELS[levelIndex]; }

    // ---- Sonido simulado con Web Audio API (sin archivos externos) ----
    let audioCtx = null;
    function getAudioCtx() {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      return audioCtx;
    }
    function playTone(freq, duration, type = 'sine') {
      if (!soundToggle || !soundToggle.checked) return;
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }
    const sfx = {
      correct: () => { playTone(660, 0.18, 'triangle'); playTone(880, 0.22, 'triangle'); },
      wrong:   () => { playTone(180, 0.28, 'sawtooth'); },
      over:    () => { playTone(140, 0.5, 'square'); },
      levelUp: () => { playTone(520, 0.12, 'sine'); playTone(660, 0.12, 'sine'); playTone(880, 0.22, 'sine'); }
    };

    function updateHUD() {
      scoreVal.textContent = score;
      livesVal.textContent = lives;
      streakVal.textContent = streak;
    }

    // Revisa si el puntaje actual alcanza el siguiente nivel y, si es así,
    // sube la dificultad y avisa al jugador con un pulso visual + sonoro.
    function checkLevelUp() {
      let newIndex = levelIndex;
      for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (score >= LEVELS[i].minScore) { newIndex = i; break; }
      }
      if (newIndex !== levelIndex) {
        levelIndex = newIndex;
        if (levelBadge) {
          levelBadge.textContent = `Nivel ${levelIndex + 1}`;
          levelBadge.classList.remove('is-levelup');
          void levelBadge.offsetWidth; // reinicia la animación
          levelBadge.classList.add('is-levelup');
        }
        sfx.levelUp();
        hint.innerHTML = `⬆️ <strong>${getLevel().label}</strong> — cae más rápido y aparecen más tentaciones. ¡Mantén la calma!`;
      }
    }

    function spawnItem() {
      const lvl = getLevel();
      const isLight = Math.random() > lvl.shadowRatio;
      const pool = isLight ? LIGHT_ITEMS : SHADOW_ITEMS;
      const item = pool[Math.floor(Math.random() * pool.length)];

      const el = document.createElement('button');
      el.className = 'falling-item';
      el.type = 'button';
      el.textContent = item.icon;
      el.setAttribute('aria-label', item.label);
      el.dataset.correctSide = isLight ? 'luz' : 'sombra';

      const stageWidth = sky.clientWidth;
      const startX = 24 + Math.random() * (stageWidth - 48);
      el.style.left = startX + 'px';
      el.style.top = '-40px';

      sky.appendChild(el);

      let posY = -40;
      const speed = lvl.fallSpeed + Math.random() * 1.1;
      const kind = el.dataset.correctSide; // 'luz' (bueno) | 'sombra' (malo)
      let settled = false; // evita doble disparo entre click y touchstart

      function frame() {
        if (!running || !el.isConnected) return;
        posY += speed;
        el.style.top = posY + 'px';

        if (posY > sky.clientHeight) {
          if (el.isConnected) el.remove();
          missItem(kind);
          return;
        }
        el.__raf = requestAnimationFrame(frame);
      }
      el.__raf = requestAnimationFrame(frame);

      function handleCatch(e) {
        if (settled) return;
        settled = true;
        e.preventDefault();
        catchItem(el, kind);
      }
      // click cubre mouse/teclado; touchstart evita el retraso táctil y el "click fantasma"
      el.addEventListener('click', handleCatch);
      el.addEventListener('touchstart', handleCatch, { passive: false });
    }

    // Un acto de Luz que cae sin tocarse es solo una oportunidad perdida: no cuesta vidas.
    // Un acto de Sombra que cae sin tocarse fue evitado a tiempo: se recompensa levemente.
    function missItem(kind) {
      if (kind === 'sombra') {
        score += 5;
        hint.innerHTML = 'Bien hecho: dejaste pasar esa sombra sin tocarla 🌤️';
      } else {
        hint.innerHTML = 'Se te escapó un acto de luz, pero puedes seguir intentándolo.';
      }
      updateHUD();
      checkLevelUp();
    }

    function flashBasket(basketEl, danger = false) {
      basketEl.classList.add(danger ? 'is-danger' : 'is-hit');
      setTimeout(() => basketEl.classList.remove(danger ? 'is-danger' : 'is-hit'), 260);
    }

    // Regla de oro del juego: SOLO tocar un acto de Sombra cuesta una vida.
    // Tocar un acto de Luz siempre suma puntos y NUNCA descuenta vida.
    function catchItem(el, kind) {
      if (!running) return;
      cancelAnimationFrame(el.__raf);
      if (el.isConnected) el.remove();

      if (kind === 'luz') {
        score += 10 + Math.min(streak, 5) * 2;
        streak += 1;
        flashBasket(basketLuz);
        sfx.correct();
        hint.innerHTML = streak >= 3
          ? `¡Racha de ${streak}! Tu árbol de luz está floreciendo 🌿`
          : '¡Bien hecho! Ese acto de luz llegó a tu árbol.';
        updateHUD();
        checkLevelUp();
      } else {
        lives -= 1;
        streak = 0;
        flashBasket(basketSombra, true);
        sfx.wrong();
        hint.innerHTML = 'Esa era una sombra — te costó una vida por tocarla.';
        updateHUD();
        if (lives <= 0) { endGame(false); return; }
      }
    }

    function startGame() {
      score = 0; lives = 3; streak = 0; levelIndex = 0;
      updateHUD();
      sky.innerHTML = '';
      running = true;
      startBtn.hidden = true;
      resetBtn.hidden = true;
      if (levelBadge) {
        levelBadge.textContent = 'Nivel 1';
        levelBadge.classList.remove('is-levelup');
      }
      hint.innerHTML = 'Toca los actos de <strong>Luz</strong> para sumar puntos. Puedes dejar caer los de <strong>Sombra</strong> sin miedo — solo pierdes una vida si los tocas. La dificultad sube por niveles a medida que avanzas.';

      function loop() {
        if (!running) return;
        spawnItem();
        spawnTimer = setTimeout(loop, getLevel().spawnDelay);
      }
      loop();
    }

    function endGame(won) {
      running = false;
      clearTimeout(spawnTimer);
      sky.querySelectorAll('.falling-item').forEach(el => {
        cancelAnimationFrame(el.__raf);
        el.remove();
      });
      sfx.over();
      hint.innerHTML = `Juego terminado en <strong>${getLevel().label}</strong> — anotaste <strong>${score} puntos</strong>. ${score >= 140 ? 'Tu árbol de luz creció fuerte 🌳' : '¡Sigue practicando, cada intento cuenta!'}`;
      resetBtn.hidden = false;
    }

    startBtn?.addEventListener('click', startGame);
    resetBtn?.addEventListener('click', startGame);
  })();

  /* ---------------------------------------------------------
     9) FORMULARIO DE CONTACTO — validación en tiempo real
  --------------------------------------------------------- */
  (function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name: document.getElementById('fName'),
      email: document.getElementById('fEmail'),
      role: document.getElementById('fRole'),
      message: document.getElementById('fMessage')
    };
    const errors = {
      name: document.getElementById('errName'),
      email: document.getElementById('errEmail'),
      role: document.getElementById('errRole'),
      message: document.getElementById('errMessage')
    };

    const validators = {
      name: (v) => v.trim().length >= 3 ? '' : 'Escribe tu nombre completo (mínimo 3 letras).',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Ingresa un correo electrónico válido.',
      role: (v) => v ? '' : 'Selecciona tu rol.',
      message: (v) => v.trim().length >= 10 ? '' : 'Cuéntanos un poco más (mínimo 10 caracteres).'
    };

    function validateField(key) {
      const field = fields[key];
      const errEl = errors[key];
      const message = validators[key](field.value);
      const wrapper = field.closest('.field');

      wrapper.classList.toggle('has-error', Boolean(message));
      wrapper.classList.toggle('is-valid', !message && field.value.trim() !== '');
      errEl.textContent = message;
      return !message;
    }

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const evt = (field.tagName === 'SELECT') ? 'change' : 'input';
      field.addEventListener(evt, () => validateField(key));
      field.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);
      if (!allValid) {
        const firstInvalid = Object.keys(fields).find(k => fields[k].closest('.field').classList.contains('has-error'));
        fields[firstInvalid]?.focus();
        return;
      }

      const submitBtn = document.getElementById('formSubmit');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      // Simulación de envío — reemplazar por la llamada real al backend / servicio de correo.
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        document.getElementById('formFields').hidden = true;
        const success = document.getElementById('formSuccess');
        success.hidden = false;
        success.querySelector('.form__check circle').style.animation = 'none';
        success.querySelector('.form__check path').style.animation = 'none';
        void success.offsetWidth; // reflow para reiniciar animación
        success.querySelector('.form__check circle').style.animation = '';
        success.querySelector('.form__check path').style.animation = '';
        form.reset();
      }, 1100);
    });
  })();

  /* ---------------------------------------------------------
     10) Año / detalles menores
  --------------------------------------------------------- */
  // Reservado para futuras mejoras (p. ej. tema oscuro, i18n, etc.)

})();

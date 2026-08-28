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

    let score = 0;
    let lives = 3;
    let streak = 0;
    let running = false;
    let spawnTimer = null;
    let fallSpeed = 2.4; // px per frame baseline

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
      over:    () => { playTone(140, 0.5, 'square'); }
    };

    function updateHUD() {
      scoreVal.textContent = score;
      livesVal.textContent = lives;
      streakVal.textContent = streak;
    }

    function spawnItem() {
      const isLight = Math.random() > 0.48;
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
      const speed = fallSpeed + Math.random() * 1.2;

      function frame() {
        if (!running || !el.isConnected) return;
        posY += speed;
        el.style.top = posY + 'px';

        if (posY > sky.clientHeight) {
          el.remove();
          missItem();
          return;
        }
        el.__raf = requestAnimationFrame(frame);
      }
      el.__raf = requestAnimationFrame(frame);

      el.addEventListener('click', () => catchItem(el));
    }

    function missItem() {
      lives -= 1;
      streak = 0;
      updateHUD();
      hint.innerHTML = 'Se te escapó una decisión sin tomar. ¡Sigue atento al cielo!';
      if (lives <= 0) endGame(false);
    }

    function flashBasket(basketEl) {
      basketEl.classList.add('is-hit');
      setTimeout(() => basketEl.classList.remove('is-hit'), 220);
    }

    function catchItem(el) {
      if (!running) return;
      // El "lado" se decide por cuál cesta está más cerca en X en el momento del click,
      // simplificado: el jugador toca el ítem y elige la cesta correspondiente con dos zonas.
      const stageRect = sky.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2 - stageRect.left;
      const isLeftHalf = itemCenterX < stageRect.width / 2;
      const chosenSide = isLeftHalf ? 'luz' : 'sombra';
      const correctSide = el.dataset.correctSide;

      cancelAnimationFrame(el.__raf);
      el.remove();

      const basketEl = correctSide === 'luz' ? basketLuz : basketSombra;

      if (chosenSide === correctSide) {
        score += 10 + Math.min(streak, 5) * 2;
        streak += 1;
        flashBasket(basketEl);
        sfx.correct();
        hint.innerHTML = streak >= 3
          ? `¡Racha de ${streak}! Tu árbol de luz está floreciendo 🌿`
          : 'Bien hecho, esa decisión llegó a la rama correcta.';
      } else {
        lives -= 1;
        streak = 0;
        sfx.wrong();
        hint.innerHTML = 'Esa decisión iba en la otra rama. Observa bien antes de tocar.';
        if (lives <= 0) { updateHUD(); endGame(false); return; }
      }
      updateHUD();
    }

    function startGame() {
      score = 0; lives = 3; streak = 0; fallSpeed = 2.4;
      updateHUD();
      sky.innerHTML = '';
      running = true;
      startBtn.hidden = true;
      resetBtn.hidden = true;
      hint.innerHTML = 'Toca cada acto en la mitad de la pantalla que corresponde a su rama: izquierda para <strong>Luz</strong>, derecha para <strong>Sombra</strong>.';

      let spawnDelay = 1100;
      function loop() {
        if (!running) return;
        spawnItem();
        fallSpeed = Math.min(fallSpeed + 0.03, 5.5);
        spawnDelay = Math.max(spawnDelay - 8, 620);
        spawnTimer = setTimeout(loop, spawnDelay);
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
      hint.innerHTML = `Juego terminado — anotaste <strong>${score} puntos</strong>. ${score >= 80 ? 'Tu árbol de luz creció fuerte 🌳' : '¡Sigue practicando, cada intento cuenta!'}`;
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

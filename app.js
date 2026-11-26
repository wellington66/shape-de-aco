(function () {
  'use strict';

  /* ==========================================================================
     CONFIG — Conecte sua futura página de checkout/pagamento em 1 linha abaixo
     ========================================================================== */
  var CONFIG = {
    // Deixe vazio enquanto não tiver a página de checkout pronta.
    // Quando tiver, cole a URL aqui (ex.: 'https://seusite.com/checkout' ou 'https://pay.wiapy.com/...')
    CHECKOUT_URL: '/p54.html',
    LEAD_ENDPOINT: 'https://recupera-pix-eosin.vercel.app/api/lead',
    META_PIXEL_ID: '1566100141500586',
    GA4_ID: 'G-9DZ4FVST4X',
    CLARITY_ID: 'z9hm23z554'
  };

  var IS_LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:' || /treino-aco-checkout-cakto/.test(location.hostname);
  var STEPS = window.TREINO_DE_ACO_STEPS || [];

  /* ==================== UTM & CLICK-ID PERSISTENCE ==================== */
  var TRACK_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'];
  (function persistUtms() {
    var sp = new URLSearchParams(location.search);
    TRACK_KEYS.forEach(function (k) {
      var v = sp.get(k);
      if (v) { try { sessionStorage.setItem('tda_bm_' + k, v); } catch (e) {} }
    });
  })();

  function getPersistedQuery() {
    var out = new URLSearchParams(location.search);
    out.delete('step');
    TRACK_KEYS.forEach(function (k) {
      if (!out.get(k)) {
        try {
          var v = sessionStorage.getItem('tda_bm_' + k);
          if (v) out.set(k, v);
        } catch (e) {}
      }
    });
    var s = out.toString();
    return s ? '?' + s : '';
  }

  /* ==================== PIXELS (ONLY IN PRODUCTION) ==================== */
  function fb() { if (window.fbq) window.fbq.apply(null, arguments); }
  function ga() { if (window.gtag) window.gtag.apply(null, arguments); }
  function cl() { if (window.clarity) window.clarity.apply(null, arguments); }

  if (!IS_LOCAL) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fb('init', CONFIG.META_PIXEL_ID);
    fb('track', 'PageView');

    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    ga('js', new Date());
    ga('config', CONFIG.GA4_ID);

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CONFIG.CLARITY_ID);
  }

  /* ==================== STATE ==================== */
  var state = {
    idx: 0,
    history: [],
    timers: [],
    unitHeight: 'cm',
    unitWeight: 'kg',
    consentChecked: false,
    scratchRevealed: false,
    answers: {
      idadeFaixa: '30-39',
      experiencia: 'Não',
      objetivo: 'Perder gordura e ganhar músculo',
      objetivosExtras: [],
      porteFisico: 'Encorpado',
      fisicoIdeal: 'Atlético',
      areasProblema: [],
      variacaoPeso: 'Mesomorfo',
      melhorForma: '1 a 2 anos',
      flexibilidade: 'Razoavelmente flexível',
      caminhada: '30 a 60 min',
      treinos3Meses: '1-2 vezes',
      intensidade: 'Moderado',
      flexoes: '1-10',
      agachamentos: '1-20',
      exAvanco: 'Sim',
      exPrancha: 'Sim',
      exTorcao: 'Sim',
      sensibilidades: [],
      duracaoTreino: '15-20 min',
      frequenciaSemanal: '3-4 vezes',
      rotinaTrabalho: 'Horário comercial',
      diaTipico: 'Sedentário',
      energiaDia: 'Oscilam',
      agua: '2 a 6 copos',
      sono: '5-6h',
      habitos: [],
      vontades: [],
      fumo: '',
      alcool: '',
      dieta: 'Tradicional',
      alturaCm: 176,
      pesoKg: 84,
      metaKg: 75,
      idadeExata: 35,
      eventosPassados: [],
      eventoFuturo: 'Viagem / Férias',
      eventoData: null,
      barreiras: [],
      motivacoes: [],
      confianca: 'Acredito que consigo!',
      email: '',
      nome: ''
    }
  };

  /* Respostas só aparecem marcadas depois que a pessoa escolhe (os valores acima são só reserva para cálculos) */
  var PICKED = {};
  state.answers = new Proxy(state.answers, { set: function (t, k, v) { t[k] = v; PICKED[k] = true; return true; } });
  function shown(k) { return PICKED[k] ? state.answers[k] : ''; }

  // Default event date = 4 months from today
  (function initDefaultEventDate() {
    var d = new Date();
    d.setMonth(d.getMonth() + 4);
    state.answers.eventoData = new Date(d.getFullYear(), d.getMonth(), Math.min(25, d.getDate()));
  })();
  delete PICKED.eventoData; // data padrão é só reserva; a pessoa escolhe no calendário

  /* ==================== DOM REFS ==================== */
  var elHeader = document.getElementById('bm-header');
  var elBtnBack = document.getElementById('btn-back');
  var elBrand = document.getElementById('header-brand');
  var elProgress = document.getElementById('header-progress');
  var elProgressLabel = document.getElementById('progress-label');
  var elP5 = [1, 2, 3, 4, 5].map(function (i) { return document.getElementById('p5-' + i); });
  var elBtnMenu = document.getElementById('btn-menu');
  var elMain = document.getElementById('bm-main');
  var elStage = document.getElementById('stage');
  var elStickyCta = document.getElementById('bm-sticky-cta');
  var elBtnPrimary = document.getElementById('btn-primary-cta');
  var elBtnSkip = document.getElementById('btn-skip-cta');
  var elHelpFab = document.getElementById('btn-help-fab');
  var elDocsDrawer = document.getElementById('docs-drawer');
  var elInfoModal = document.getElementById('info-modal');
  var elInfoTitle = document.getElementById('info-modal-title');
  var elInfoBody = document.getElementById('info-modal-body');
  var elInfoBtn = document.getElementById('info-modal-btn');

  /* ==================== DATE & METRICS HELPERS (PT-BR) ==================== */
  var MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var MONTHS_FULL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function fmtDateShort(d) { return d.getDate() + ' de ' + MONTHS_SHORT[d.getMonth()]; }
  function fmtDateFull(d) { return d.getDate() + ' de ' + MONTHS_FULL[d.getMonth()] + ' de ' + d.getFullYear(); }
  function fmtDateDayMonth(d) { return d.getDate() + ' de ' + MONTHS_FULL[d.getMonth()]; }

  function getTodayPlusDays(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  function getAgeDecadePhrase() {
    var f = state.answers.idadeFaixa;
    if (f === '18-29') return 'de 18 a 29 anos';
    if (f === '30-39') return 'na faixa dos 30 anos';
    if (f === '40-49') return 'na faixa dos 40 anos';
    return 'acima dos 50 anos';
  }

  function calcBMI(hCm, wKg) {
    var h = (hCm || 176) / 100;
    return (wKg || 84) / (h * h);
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return { key: 'under', label: 'Abaixo do peso', healthy: false };
    if (bmi < 25) return { key: 'normal', label: 'Peso normal', healthy: true };
    if (bmi < 30) return { key: 'over', label: 'Sobrepeso', healthy: false };
    return { key: 'obese', label: 'Obesidade', healthy: false };
  }

  function getEstimatedGoalDate() {
    var diff = Math.abs((state.answers.pesoKg || 84) - (state.answers.metaKg || 75));
    var weeks = Math.max(4, Math.min(24, Math.round(diff / 0.75)));
    return getTodayPlusDays(weeks * 7);
  }

  function computeFitnessScore() {
    var t3 = state.answers.treinos3Meses;
    var fl = state.answers.flexoes;
    var sq = state.answers.agachamentos;
    var cons = t3 === 'Regularmente' ? 28 : t3 === 'Algumas vezes por mês' ? 18 : t3 === '1-2 vezes' ? 10 : 6;
    var str = fl === '20+' ? 28 : fl === '11-20' ? 22 : fl === '1-10' ? 16 : 8;
    var end = sq === '40+' ? 28 : sq === '21-40' ? 22 : sq === '1-20' ? 18 : 9;
    var total = Math.round(((cons + str + end) / 90) * 100);
    var level = total >= 72 ? 'Avançado' : total >= 44 ? 'Intermediário' : 'Iniciante';
    var badge = total >= 72 ? 'Excelente base!' : total >= 44 ? 'Continue assim!' : 'Ótimo ponto de partida!';
    return { cons: cons, str: str, end: end, total: total, level: level, badge: badge };
  }

  function querLibido() {
    var A = state.answers, has = function (k, v) { return (A[k] || []).indexOf(v) >= 0; };
    return has('objetivosExtras', 'Aumentar vigor e libido') || has('eventosPassados', 'Desempenho sexual caiu');
  }

  function getAvatarByBuild() {
    var b = state.answers.porteFisico;
    if (b === 'Magro') return 'assets/img/body_1.webp';
    if (b === 'Porte médio') return 'assets/img/body_2.webp';
    if (b === 'Acima do peso') return 'assets/img/body_4.webp';
    return 'assets/img/body_3.webp';
  }

  function getGoalPhraseLower() {
    var o = (state.answers.objetivo || 'perder gordura e ganhar músculo').toLowerCase();
    return o;
  }

  function clearStepTimers() {
    state.timers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    state.timers = [];
  }

  function addTimer(fn, ms) {
    var id = setTimeout(fn, ms);
    state.timers.push(id);
    return id;
  }

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ==================== OVERLAYS (MENU / HELP / TOOLTIP) ==================== */
  function openInfoModal(title, body, btnText) {
    elInfoTitle.textContent = title;
    elInfoBody.innerHTML = body;
    elInfoBtn.textContent = btnText || 'ENTENDI';
    elInfoModal.hidden = false;
  }

  elBtnMenu.addEventListener('click', function () { elDocsDrawer.hidden = false; });
  elHelpFab.addEventListener('click', function () {
    openInfoModal(
      'Sobre o Treino de Aço',
      'Responda às perguntas rápidas para montarmos seu protocolo de Calistenia Militar em casa (sem equipamentos) sob medida para sua idade, biotipo e objetivo.',
      'CONTINUAR'
    );
  });

  document.querySelectorAll('[data-close-overlay]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ov = btn.closest('.drawer-backdrop');
      if (ov) ov.hidden = true;
    });
  });
  [elDocsDrawer, elInfoModal].forEach(function (ov) {
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.hidden = true; });
  });

  /* ==================== STICKY CTA CONTROLLER ==================== */
  var currentPrimaryHandler = null;
  var currentSkipHandler = null;

  function setStickyCta(cfg) {
    if (!cfg) {
      elStickyCta.hidden = true;
      elMain.classList.remove('has-sticky-cta');
      currentPrimaryHandler = null;
      currentSkipHandler = null;
      return;
    }
    elStickyCta.hidden = false;
    elMain.classList.add('has-sticky-cta');
    elBtnPrimary.textContent = cfg.label || 'CONTINUAR';
    elBtnPrimary.disabled = !!cfg.disabled;
    currentPrimaryHandler = cfg.onClick || null;

    if (cfg.skipLabel && cfg.onSkip) {
      elBtnSkip.hidden = false;
      elBtnSkip.textContent = cfg.skipLabel;
      currentSkipHandler = cfg.onSkip;
    } else {
      elBtnSkip.hidden = true;
      currentSkipHandler = null;
    }
  }

  elBtnPrimary.addEventListener('click', function () {
    if (!elBtnPrimary.disabled && typeof currentPrimaryHandler === 'function') {
      currentPrimaryHandler();
    }
  });
  elBtnSkip.addEventListener('click', function () {
    if (typeof currentSkipHandler === 'function') currentSkipHandler();
  });

  /* ==================== HEADER & 5-SEGMENT PROGRESS ==================== */
  function updateHeader(step) {
    elHelpFab.hidden = !step.showHelp;

    if (step.header === 'none') {
      elHeader.classList.add('is-hidden');
      elMain.classList.add('is-fullscreen');
      return;
    }

    elHeader.classList.remove('is-hidden');
    elMain.classList.remove('is-fullscreen');

    if (step.header === 'brandOnly') {
      elHeader.classList.add('is-transparent');
      elBtnBack.classList.add('is-invisible');
      elBtnMenu.classList.add('is-invisible');
      elBrand.hidden = false;
      elProgress.hidden = true;
      return;
    }

    elHeader.classList.remove('is-transparent');
    elBtnMenu.classList.remove('is-invisible');

    var hideBack = state.idx <= 1 || step.header === 'brandNoBack' || step.type === 'barLoader' || step.type === 'ringLoader';
    elBtnBack.classList.toggle('is-invisible', hideBack);

    if (step.section) {
      elBrand.hidden = true;
      elProgress.hidden = false;
      elProgressLabel.textContent = step.sectionLabel || '';
      for (var s = 1; s <= 5; s++) {
        var fill = elP5[s - 1];
        if (s < step.section) fill.style.width = '100%';
        else if (s === step.section) fill.style.width = (step.segPct || 20) + '%';
        else fill.style.width = '0%';
      }
    } else {
      elBrand.hidden = false;
      elProgress.hidden = true;
    }
  }

  /* ==================== NAVIGATION WITH BETTERME FADE TRANSITION ==================== */
  function goTo(nextIdx, isBack) {
    if (nextIdx < 0 || nextIdx >= STEPS.length) return;
    clearStepTimers();

    var currentView = elStage.querySelector('.stage-view');
    var commit = function () {
      if (!isBack && state.idx !== nextIdx) {
        state.history.push(state.idx);
      }
      state.idx = nextIdx;
      renderCurrentStep();
      preloadAhead(nextIdx);
      window.scrollTo({ top: 0, behavior: 'instant' });
      cl('set', 'etapa', 's' + nextIdx + '_' + STEPS[nextIdx].id);
    };

    if (currentView && !isBack && state.idx !== nextIdx) {
      currentView.classList.add('is-leaving');
      addTimer(commit, 110);
    } else {
      commit();
    }
  }

  /* pré-carrega e decodifica as imagens das próximas telas (troca sem travar) */
  var preImg = {};
  function preloadSrc(src) {
    if (!src || preImg[src]) return;
    var im = new Image(); im.decoding = 'async'; im.src = src; preImg[src] = im;
    if (im.decode) im.decode().catch(function () {});
  }
  function preloadStep(st) {
    if (!st) return;
    preloadSrc(st.image);
    (st.options || []).forEach(function (o) { preloadSrc(o.img); });
  }
  function preloadAhead(i) { for (var k = 1; k <= 3; k++) preloadStep(STEPS[i + k]); }
  function preloadAll() {
    var i = 0;
    (function nx() {
      if (i >= STEPS.length) return;
      preloadStep(STEPS[i++]);
      (window.requestIdleCallback || function (f) { setTimeout(f, 60); })(nx);
    })();
  }
  window.addEventListener('load', function () { setTimeout(preloadAll, 400); });

  function goNext() {
    var cur = STEPS[state.idx];
    // Skip calendar (Step 49) if user chose "Nenhum evento" on Step 48
    if (cur && cur.id === 'upcoming_event' && state.answers.eventoFuturo === 'Nenhum evento') {
      goTo(state.idx + 2);
      return;
    }
    goTo(state.idx + 1);
  }

  elBtnBack.addEventListener('click', function () {
    var prev = state.history.pop();
    while (prev !== undefined && (STEPS[prev].type === 'entryLoader' || STEPS[prev].type === 'barLoader' || STEPS[prev].type === 'ringLoader' || STEPS[prev].type === 'startTodaySplash')) {
      prev = state.history.pop();
    }
    if (prev !== undefined) goTo(prev, true);
  });

  /* ==================== SVG ICON SNIPPETS ==================== */
  var CHECK_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var LOCK_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px;"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  /* ==================== RENDERERS BY STEP TYPE ==================== */
  function renderCurrentStep() {
    var step = STEPS[state.idx];
    updateHeader(step);
    setStickyCta(null);

    var wrap = document.createElement('div');
    wrap.className = 'stage-view';
    elStage.innerHTML = '';
    elStage.appendChild(wrap);

    switch (step.type) {
      case 'entryLoader':         renderEntryLoader(wrap, step); break;
      case 'splitFirst':          renderSplitFirst(wrap, step); break;
      case 'infoSocialAge':       renderInfoSocialAge(wrap, step); break;
      case 'splitSingle':         renderSplitSingle(wrap, step); break;
      case 'infoPhoto':           renderInfoPhoto(wrap, step); break;
      case 'infoSolution':        renderInfoSolution(wrap, step); break;
      case 'multiList':           renderMultiList(wrap, step, false); break;
      case 'iconMultiList':       renderMultiList(wrap, step, true); break;
      case 'photoGrid2':          renderPhotoGrid2(wrap, step); break;
      case 'picRowMulti':         renderPicRowMulti(wrap, step); break;
      case 'singleList':          renderSingleList(wrap, step, false); break;
      case 'iconSingleList':      renderSingleList(wrap, step, true); break;
      case 'infoSomatotype':      renderInfoSomatotype(wrap, step); break;
      case 'infoFourWeeks':       renderInfoFourWeeks(wrap, step); break;
      case 'infoFitnessScore':    renderInfoFitnessScore(wrap, step); break;
      case 'exercisePref':        renderExercisePref(wrap, step); break;
      case 'photoGridMulti':      renderPhotoGridMulti(wrap, step); break;
      case 'infoResultsStress':   renderInfoResultsStress(wrap, step); break;
      case 'topPhotoGrid2':       renderTopPhotoGrid2(wrap, step); break;
      case 'smokingConsent':      renderSmokingConsent(wrap, step); break;
      case 'singleWithSkip':      renderSingleWithSkip(wrap, step); break;
      case 'groupedSingle':       renderGroupedSingle(wrap, step); break;
      case 'infoMealPlan':        renderInfoMealPlan(wrap, step); break;
      case 'heightInput':         renderHeightInput(wrap, step); break;
      case 'weightInput':         renderWeightInput(wrap, step); break;
      case 'goalWeightInput':     renderGoalWeightInput(wrap, step); break;
      case 'ageInput':            renderAgeInput(wrap, step); break;
      case 'barLoader':           renderBarLoader(wrap, step); break;
      case 'bmiWellness':         renderBmiWellness(wrap, step); break;
      case 'calendarPicker':      renderCalendarPicker(wrap, step); break;
      case 'projectionQuote':     renderProjectionQuote(wrap, step); break;
      case 'infoStrengthCompare': renderInfoStrengthCompare(wrap, step); break;
      case 'confidenceSingle':    renderConfidenceSingle(wrap, step); break;
      case 'infoAwards':          renderInfoAwards(wrap, step); break;
      case 'ringLoader':          renderRingLoader(wrap, step); break;
      case 'emailCapture':        renderEmailCapture(wrap, step); break;
      case 'nameCapture':         renderNameCapture(wrap, step); break;
      case 'planReadyGraph':      renderPlanReadyGraph(wrap, step); break;
      case 'startTodaySplash':    renderStartTodaySplash(wrap, step); break;
      case 'scratchCard':         renderScratchCard(wrap, step); break;
    }
  }

  /* 0 — ENTRY LOADER */
  function renderEntryLoader(wrap, step) {
    wrap.innerHTML =
      '<div class="entry-loader-wrap">' +
        '<h1 class="entry-loader-title">' + step.title + '</h1>' +
        '<div class="entry-loader-hero"><img src="' + step.image + '" alt="Calistenia Militar Treino de Aço"></div>' +
        '<div class="entry-loader-bar-track"><div class="entry-loader-bar-fill" id="el-fill"></div></div>' +
        '<p class="entry-loader-note">' + step.note + '</p>' +
        '<p class="entry-loader-sub">' + step.sub + '</p>' +
      '</div>';
    var fill = wrap.querySelector('#el-fill');
    var pct = 0;
    var iv = setInterval(function () {
      pct = Math.min(100, pct + 10);
      fill.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(iv);
        addTimer(function () { goTo(1); }, 150);
      }
    }, 100);
    state.timers.push(iv);
  }

  /* 1 — SPLIT FIRST PAGE (AGE + DYNAMIC TODAY & +2 MONTHS) */
  function renderSplitFirst(wrap, step) {
    var now = new Date();
    var targetMonth = MONTHS_FULL[(now.getMonth() + 2) % 12].toUpperCase();
    var todayLabel = now.getDate() + ' DE ' + MONTHS_SHORT[now.getMonth()].toUpperCase();

    var optsHtml = step.options.map(function (o) {
      return '<button type="button" class="answer-card" data-val="' + esc(o.value) + '">' +
        '<span class="answer-label">' + esc(o.label) + '</span>' +
        '<span class="radio-ring"></span>' +
      '</button>';
    }).join('');

    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-kicker">COMECE <strong>HOJE, ' + todayLabel + '</strong> PARA FICAR IRRECONHECÍVEL ATÉ <strong>' + targetMonth + '</strong></p>' +
      '<div class="split-hero-stage">' +
        '<div class="split-bg-figure"><img src="' + step.image + '" alt="Treino de Aço"></div>' +
        '<div class="split-options-col">' + optsHtml + '</div>' +
      '</div>' +
      '<p class="legal-footer-s1">Ao <strong>escolher sua idade e continuar</strong>, você concorda com nossos <a href="legal/termos.html">Termos de Uso</a> | <a href="legal/privacidade.html">Política de Privacidade</a><br>Por favor, revise antes de continuar.</p>';

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 2 — SOCIAL PROOF + BRAZILIAN REFERENCES */
  function renderInfoSocialAge(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title center">Mais de <span class="accent">970.000</span> homens</h2>' +
      '<p class="bm-sub center">' + getAgeDecadePhrase() + ' já experimentaram a Calistenia Militar para transformar o físico em casa</p>' +
      '<div class="media-frame date-chip-frame"><img src="' + step.image + '" alt="Referências brasileiras Treino de Aço">' +
        '<span class="date-chip-cover" aria-hidden="true"></span><span class="date-chip">Seu início · ' + fmtDateDayMonth(new Date()) + '</span></div>';
    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 3, 5, 11, 16, 20 — SPLIT SINGLE-SELECT WITH RIGHT HERO */
  function renderSplitSingle(wrap, step) {
    var curVal = shown(step.key);
    var optsHtml = step.options.map(function (o) {
      var sel = curVal === o.value;
      return '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
        '<span class="answer-label">' + esc(o.label) + '</span>' +
        '<span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span>' +
      '</button>';
    }).join('');

    wrap.innerHTML =
      '<h2 class="bm-title">' + esc(step.title) + '</h2>' +
      '<div class="split-hero-stage" style="margin-top:16px;">' +
        '<div class="split-bg-figure"><img src="' + step.image + '" alt="Avatar Treino de Aço"></div>' +
        '<div class="split-options-col' + (step.wideOptions ? ' wide' : '') + '">' + optsHtml + '</div>' +
      '</div>';

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) {
          b.classList.remove('is-selected');
          b.querySelector('.radio-ring').innerHTML = '';
        });
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 4, 32 — INFO PHOTO INTERSTITIAL */
  function renderInfoPhoto(wrap, step) {
    wrap.innerHTML =
      '<div class="media-frame"><img src="' + step.image + '" alt="' + esc(step.title) + '"></div>' +
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub center">' + step.sub + '</p>';
    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 6 — APP 3-PHONE SOLUTION INTERSTITIAL */
  function renderInfoSolution(wrap, step) {
    wrap.innerHTML =
      '<div class="media-frame"><img src="' + step.image + '" alt="App Treino de Aço"></div>' +
      '<h2 class="bm-title center">A solução perfeita está bem aqui!</h2>' +
      '<p class="bm-sub center">Para homens <strong>' + getAgeDecadePhrase() + '</strong>, a Calistenia Militar é excelente para <strong>' + getGoalPhraseLower() + '</strong>. Vamos ajustar cada treino ao seu corpo para você ver resultados em poucas semanas!</p>';
    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 7, 35, 36, 47, 51, 53 — MULTI-SELECT LIST (PLAIN OR WITH 40x40 CIRCULAR ICONS) */
  function renderMultiList(wrap, step, withIcons) {
    var selected = (state.answers[step.key] || []).slice();
    var html = '<h2 class="bm-title">' + esc(step.title) + '</h2>';
    if (step.sub) html += '<p class="bm-sub">' + esc(step.sub) + '</p>';
    html += '<div class="answer-stack">' + step.options.map(function (o) {
      var isSel = selected.indexOf(o.value) > -1;
      return '<button type="button" class="answer-card' + (isSel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '" data-excl="' + (o.exclusive ? '1' : '0') + '">' +
        '<div class="answer-card-left">' +
          (withIcons ? '<span class="circle-icon">' + o.icon + '</span>' : '') +
          '<span class="answer-label">' + esc(o.label) + '</span>' +
        '</div>' +
        '<span class="check-box">' + CHECK_SVG + '</span>' +
      '</button>';
    }).join('') + '</div>';
    wrap.innerHTML = html;

    function sync() {
      state.answers[step.key] = selected.slice();
      elBtnPrimary.disabled = selected.length === 0;
    }

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-val');
        var excl = btn.getAttribute('data-excl') === '1';
        if (excl) {
          selected = btn.classList.contains('is-selected') ? [] : [v];
          wrap.querySelectorAll('.answer-card').forEach(function (b) {
            b.classList.toggle('is-selected', b === btn && selected.length > 0);
          });
        } else {
          wrap.querySelectorAll('.answer-card[data-excl="1"]').forEach(function (b) {
            b.classList.remove('is-selected');
            selected = selected.filter(function (x) { return x !== b.getAttribute('data-val'); });
          });
          var pos = selected.indexOf(v);
          if (pos > -1) { selected.splice(pos, 1); btn.classList.remove('is-selected'); }
          else { selected.push(v); btn.classList.add('is-selected'); }
        }
        sync();
      });
    });

    setStickyCta({ label: step.cta || 'PRÓXIMO PASSO', disabled: selected.length === 0, onClick: goNext });
  }

  /* 8, 9 — 2x2 PHOTO GRID SINGLE-SELECT */
  function renderPhotoGrid2(wrap, step) {
    var cur = shown(step.key);
    var html = '<h2 class="bm-title center">' + esc(step.title) + '</h2>';
    if (step.sub) html += '<p class="bm-sub center">' + esc(step.sub) + '</p>';
    html += '<div class="photo-grid-2">' + step.options.map(function (o) {
      var sel = cur === o.value;
      return '<button type="button" class="photo-tile' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
        '<div class="photo-tile-img"><img src="' + o.img + '" alt="' + esc(o.label) + '"></div>' +
        '<div class="photo-tile-bar"><span>' + esc(o.label) + '</span><span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span></div>' +
      '</button>';
    }).join('') + '</div>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('.photo-tile').forEach(function (tile) {
      tile.addEventListener('click', function () {
        wrap.querySelectorAll('.photo-tile').forEach(function (t) {
          t.classList.remove('is-selected');
          t.querySelector('.radio-ring').innerHTML = '';
        });
        tile.classList.add('is-selected');
        tile.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = tile.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 10 — PROBLEM AREAS HORIZONTAL PICTURE CARDS */
  function renderPicRowMulti(wrap, step) {
    var selected = (state.answers[step.key] || []).slice();
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub center">' + esc(step.sub) + '</p>' +
      '<div class="answer-stack">' + step.options.map(function (o) {
        var sel = selected.indexOf(o.value) > -1;
        return '<button type="button" class="pic-row-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
          '<div class="pic-row-left"><span class="check-box">' + CHECK_SVG + '</span><span class="answer-label">' + esc(o.label) + '</span></div>' +
          '<img class="pic-row-thumb" src="' + o.img + '" alt="' + esc(o.label) + '">' +
        '</button>';
      }).join('') + '</div>';

    wrap.querySelectorAll('.pic-row-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var v = card.getAttribute('data-val');
        var pos = selected.indexOf(v);
        if (pos > -1) { selected.splice(pos, 1); card.classList.remove('is-selected'); }
        else { selected.push(v); card.classList.add('is-selected'); }
        state.answers[step.key] = selected.slice();
        elBtnPrimary.disabled = selected.length === 0;
      });
    });

    setStickyCta({ label: step.cta, disabled: selected.length === 0, onClick: goNext });
  }

  /* 12, 14, 15, 18, 19, 26, 27, 29, 30, 31, 48 — SINGLE LIST */
  function renderSingleList(wrap, step, withIcons) {
    var cur = shown(step.key);
    var html = '<h2 class="bm-title">' + esc(step.title) + '</h2>';
    if (step.sub) html += '<p class="bm-sub">' + esc(step.sub) + '</p>';
    html += '<div class="answer-stack">' + step.options.map(function (o) {
      var sel = cur === o.value;
      return '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
        '<div class="answer-card-left">' +
          (withIcons ? '<span class="circle-icon">' + o.icon + '</span>' : '') +
          '<div><span class="answer-label">' + esc(o.label) + '</span>' + (o.desc ? '<span class="answer-desc">' + esc(o.desc) + '</span>' : '') + '</div>' +
        '</div>' +
        '<span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span>' +
      '</button>';
    }).join('') + '</div>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) {
          b.classList.remove('is-selected');
          b.querySelector('.radio-ring').innerHTML = '';
        });
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 13 — SOMATOTYPE RESULT + FULL BODY 20 MIN PREVIEW */
  function renderInfoSomatotype(wrap, step) {
    var soma = state.answers.variacaoPeso || 'Mesomorfo';
    var descMap = {
      Ectomorfo: 'Você tem metabolismo acelerado e precisa de estímulos focados em tensão muscular e progressão inteligente para ganhar densidade e força.',
      Mesomorfo: 'Você responde rápido aos estímulos certos. Com a Calistenia Militar estruturada, consegue queimar gordura e definir músculos em poucas semanas.',
      Endomorfo: 'Você tende a acumular gordura com facilidade, mas ganha força muito bem. Nossos blocos metabólicos curtos aceleram a queima calórica sem sobrecarregar.'
    };
    wrap.innerHTML =
      '<div class="media-frame"><img src="' + step.image + '" alt="Treino de corpo inteiro 20 min"></div>' +
      '<h2 class="bm-title center">Parece que seu biotipo é <span class="accent">' + esc(soma) + '</span></h2>' +
      '<p class="bm-sub center">' + descMap[soma] + '</p>';
    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 17 — ANIMATED 4-WEEK MILESTONE BAR CHART (EXACT step_45.png!) */
  function renderInfoFourWeeks(wrap, step) {
    var now = new Date();
    var todayText = now.getDate() + ' ' + MONTHS_SHORT[now.getMonth()];
    wrap.innerHTML =
      '<h2 class="bm-title">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub">' + step.sub + '</p>' +
      '<div class="four-week-card">' +
        '<div class="four-week-bars">' +
          '<div class="fw-today-wrap"><div class="fw-today-box">Hoje<br>' + todayText + '<div style="margin-top:4px;font-size:1rem;">✦</div></div></div>' +
          '<div class="fw-col"><div class="fw-bar w1" data-h="76">Mais energia</div><div class="fw-pill">Sem 1</div></div>' +
          '<div class="fw-col"><div class="fw-bar w2" data-h="108">Menos tensão</div><div class="fw-pill">Sem 2</div></div>' +
          '<div class="fw-col"><div class="fw-bar w3" data-h="142">Mais força</div><div class="fw-pill">Sem 3</div></div>' +
          '<div class="fw-col"><div class="fw-bar w4" data-h="182"><div class="fw-trophy">🏆</div>Novo Você</div><div class="fw-pill w4">Sem 4</div></div>' +
        '</div>' +
      '</div>';

    var bars = wrap.querySelectorAll('.fw-bar');
    bars.forEach(function (bar, i) {
      addTimer(function () {
        bar.style.height = bar.getAttribute('data-h') + 'px';
      }, 220 + i * 260);
    });

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 21 — FITNESS SCORE BREAKDOWN */
  function renderInfoFitnessScore(wrap, step) {
    var sc = computeFitnessScore();
    function segsHTML(val) {
      var s1 = Math.min(100, (val / 10) * 100);
      var s2 = val > 10 ? Math.min(100, ((val - 10) / 10) * 100) : 0;
      var s3 = val > 20 ? Math.min(100, ((val - 20) / 10) * 100) : 0;
      return '<div class="score-segs-3">' +
        '<div class="score-seg"><div class="score-seg-fill" data-w="' + s1 + '"></div></div>' +
        '<div class="score-seg"><div class="score-seg-fill" data-w="' + s2 + '"></div></div>' +
        '<div class="score-seg"><div class="score-seg-fill" data-w="' + s3 + '"></div></div>' +
      '</div>';
    }

    wrap.innerHTML =
      '<h2 class="bm-title center">Seu nível físico é <span class="accent">' + sc.level + '</span></h2>' +
      '<p class="bm-sub center">Calibramos a dificuldade inicial do seu Treino de Aço com base na sua força e consistência atuais.</p>' +
      '<div class="surface-card">' +
        '<div class="score-head-row">' +
          '<div><div style="font-size:0.75rem;color:var(--text-tertiary);font-weight:700;">PONTUAÇÃO TOTAL</div><div style="font-size:1.75rem;font-weight:800;">' + sc.total + '<span style="font-size:0.9rem;color:var(--text-tertiary);">/100</span></div></div>' +
          '<span class="score-pill">' + sc.badge + '</span>' +
        '</div>' +
        '<div class="score-metric"><div class="score-metric-top"><span>CONSISTÊNCIA</span><strong>' + sc.cons + '/30</strong></div>' + segsHTML(sc.cons) + '</div>' +
        '<div class="score-metric"><div class="score-metric-top"><span>FORÇA</span><strong>' + sc.str + '/30</strong></div>' + segsHTML(sc.str) + '</div>' +
        '<div class="score-metric"><div class="score-metric-top"><span>RESISTÊNCIA</span><strong>' + sc.end + '/30</strong></div>' + segsHTML(sc.end) + '</div>' +
      '</div>';

    addTimer(function () {
      wrap.querySelectorAll('.score-seg-fill').forEach(function (el) {
        el.style.width = el.getAttribute('data-w') + '%';
      });
    }, 120);

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 22, 23, 24 — EXERCISE PREFERENCE CARDS */
  function renderExercisePref(wrap, step) {
    var cur = shown(step.key);
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<div class="top-photo-card"><img src="' + step.image + '" alt="' + esc(step.badge) + '"><span class="exercise-badge">' + esc(step.badge) + '</span></div>' +
      '<div class="answer-stack">' + step.options.map(function (o) {
        var sel = cur === o.value;
        return '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
          '<span class="answer-label">' + esc(o.label) + '</span><span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span>' +
        '</button>';
      }).join('') + '</div>';

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) { b.classList.remove('is-selected'); b.querySelector('.radio-ring').innerHTML = ''; });
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 25 — PHOTO GRID MULTI-SELECT (SENSITIVE BACK / KNEES / NONE) */
  function renderPhotoGridMulti(wrap, step) {
    var selected = (state.answers[step.key] || []).slice();
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub center">' + esc(step.sub) + '</p>' +
      '<div class="photo-grid-2">' + step.options.map(function (o) {
        var sel = selected.indexOf(o.value) > -1;
        return '<button type="button" class="photo-tile' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '" data-excl="' + (o.exclusive ? '1' : '0') + '">' +
          '<div class="photo-tile-img"><img src="' + o.img + '" alt="' + esc(o.label) + '"></div>' +
          '<div class="photo-tile-bar"><span>' + esc(o.label) + '</span><span class="check-box">' + CHECK_SVG + '</span></div>' +
        '</button>';
      }).join('') + '</div>';

    wrap.querySelectorAll('.photo-tile').forEach(function (tile) {
      tile.addEventListener('click', function () {
        var v = tile.getAttribute('data-val');
        var excl = tile.getAttribute('data-excl') === '1';
        if (excl) {
          selected = tile.classList.contains('is-selected') ? [] : [v];
          wrap.querySelectorAll('.photo-tile').forEach(function (t) {
            t.classList.toggle('is-selected', t === tile && selected.length > 0);
          });
        } else {
          wrap.querySelectorAll('.photo-tile[data-excl="1"]').forEach(function (t) {
            t.classList.remove('is-selected');
            selected = selected.filter(function (x) { return x !== t.getAttribute('data-val'); });
          });
          var pos = selected.indexOf(v);
          if (pos > -1) { selected.splice(pos, 1); tile.classList.remove('is-selected'); }
          else { selected.push(v); tile.classList.add('is-selected'); }
        }
        state.answers[step.key] = selected.slice();
        elBtnPrimary.disabled = selected.length === 0;
      });
    });

    setStickyCta({ label: step.cta, disabled: selected.length === 0, onClick: goNext });
  }

  /* 28 — ANIMATED DUAL-CURVE SVG: RESULTS VS STRESS */
  function renderInfoResultsStress(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub">' + step.sub + '</p>' +
      '<div class="surface-card">' +
        '<svg viewBox="0 0 340 190" width="100%" style="display:block;height:auto;">' +
          '<g stroke="rgba(235,225,211,0.12)" stroke-dasharray="3 4">' +
            '<line x1="40" y1="20" x2="40" y2="165"/>' +
            '<line x1="105" y1="20" x2="105" y2="165"/>' +
            '<line x1="170" y1="20" x2="170" y2="165"/>' +
            '<line x1="235" y1="20" x2="235" y2="165"/>' +
            '<line x1="300" y1="20" x2="300" y2="165"/>' +
          '</g>' +
          '<path id="stress-path" d="M 30 48 C 110 56, 195 118, 310 148" fill="none" stroke="rgba(235,225,211,0.34)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="360" stroke-dashoffset="360"/>' +
          '<path id="results-path" d="M 30 148 C 115 136, 200 72, 310 38" fill="none" stroke="#888342" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="360" stroke-dashoffset="360"/>' +
          '<circle cx="310" cy="38" r="6" fill="#EBE1D3" stroke="#888342" stroke-width="3"/>' +
          '<circle cx="310" cy="148" r="5" fill="#737168"/>' +
          '<rect x="218" y="10" width="96" height="22" rx="11" fill="#888342"/><text x="266" y="25" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Resultados</text>' +
          '<rect x="228" y="156" width="84" height="22" rx="11" fill="#2f2c25"/><text x="270" y="171" text-anchor="middle" fill="#EBE1D3" font-size="11" font-weight="600">Estresse</text>' +
        '</svg>' +
        '<p style="margin:8px 0 0;font-size:0.72rem;color:var(--text-tertiary);text-align:center;">Gráfico meramente ilustrativo</p>' +
      '</div>';

    addTimer(function () {
      var rp = wrap.querySelector('#results-path');
      var sp = wrap.querySelector('#stress-path');
      rp.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)';
      sp.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)';
      rp.style.strokeDashoffset = '0';
      sp.style.strokeDashoffset = '0';
    }, 120);

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 33, 34 — TOP PHOTO + 2x2 GRID (WATER / SLEEP) */
  function renderTopPhotoGrid2(wrap, step) {
    var cur = shown(step.key);
    var html = '<h2 class="bm-title center">' + esc(step.title) + '</h2>';
    if (step.sub) html += '<p class="bm-sub center">' + esc(step.sub) + '</p>';
    html += '<div class="top-photo-card"><img src="' + step.image + '" alt="' + esc(step.title) + '"></div>';
    html += '<div class="grid-2x2-text">' + step.options.map(function (o) {
      var sel = cur === o.value;
      return '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '"><span class="answer-label">' + esc(o.label) + '</span></button>';
    }).join('') + '</div>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        state.answers[step.key] = btn.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 37 — SMOKING WITH HEALTH CONSENT CHECKBOX + CORAL ALERT + SKIP */
  function renderSmokingConsent(wrap, step) {
    var cur = shown(step.key);
    wrap.innerHTML =
      '<div class="alert-banner" id="consent-alert" hidden><span>Consentimento obrigatório para continuar</span><button type="button" class="alert-close" id="close-alert">&times;</button></div>' +
      '<h2 class="bm-title">' + esc(step.title) + '</h2>' +
      '<div class="answer-stack">' + step.options.map(function (o) {
        var sel = cur === o.value;
        return '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
          '<span class="answer-label">' + esc(o.label) + '</span><span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span>' +
        '</button>';
      }).join('') + '</div>' +
      '<label class="consent-row">' +
        '<input type="checkbox" id="health-consent-cb" ' + (state.consentChecked ? 'checked' : '') + '>' +
        '<span>Concordo com o processamento dos meus dados de saúde pelo <strong>Treino de Aço</strong> para personalizar meu plano de treino. <a href="legal/privacidade.html">Política de Privacidade</a></span>' +
      '</label>';

    var alertEl = wrap.querySelector('#consent-alert');
    var cb = wrap.querySelector('#health-consent-cb');
    wrap.querySelector('#close-alert').addEventListener('click', function () { alertEl.hidden = true; });
    cb.addEventListener('change', function () {
      state.consentChecked = cb.checked;
      if (cb.checked) alertEl.hidden = true;
    });

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) { b.classList.remove('is-selected'); b.querySelector('.radio-ring').innerHTML = ''; });
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        elBtnPrimary.disabled = false;
      });
    });

    setStickyCta({
      label: step.cta,
      disabled: !shown(step.key),
      onClick: function () {
        if (!state.consentChecked) {
          alertEl.hidden = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        goNext();
      },
      skipLabel: step.skipLabel,
      onSkip: function () {
        state.answers[step.key] = 'Prefiro não informar';
        goNext();
      }
    });
  }

  /* 38 — ALCOHOL WITH CONTINUE + SKIP */
  function renderSingleWithSkip(wrap, step) {
    var cur = shown(step.key);
    wrap.innerHTML =
      '<h2 class="bm-title">' + esc(step.title) + '</h2>' +
      '<div class="answer-stack">' + step.options.map(function (o) {
        var sel = cur === o.value;
        return '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
          '<span class="answer-label">' + esc(o.label) + '</span><span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span>' +
        '</button>';
      }).join('') + '</div>';

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) { b.classList.remove('is-selected'); b.querySelector('.radio-ring').innerHTML = ''; });
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        elBtnPrimary.disabled = false;
      });
    });

    setStickyCta({
      label: step.cta,
      disabled: !shown(step.key),
      onClick: goNext,
      skipLabel: step.skipLabel,
      onSkip: function () { state.answers[step.key] = 'Pulado'; goNext(); }
    });
  }

  /* 39 — GROUPED DIET PREFERENCE */
  function renderGroupedSingle(wrap, step) {
    var cur = shown(step.key);
    var html = '<h2 class="bm-title">' + esc(step.title) + '</h2>';
    step.groups.forEach(function (g) {
      html += '<div class="group-heading">' + esc(g.heading) + '</div><div class="answer-stack">';
      g.options.forEach(function (o) {
        var sel = cur === o.value;
        html += '<button type="button" class="answer-card' + (sel ? ' is-selected' : '') + '" data-val="' + esc(o.value) + '">' +
          '<div class="answer-card-left"><span class="circle-icon">' + o.icon + '</span><span class="answer-label">' + esc(o.label) + '</span></div>' +
          '<span class="radio-ring">' + (sel ? CHECK_SVG : '') + '</span>' +
        '</button>';
      });
      html += '</div>';
    });
    wrap.innerHTML = html;

    wrap.querySelectorAll('.answer-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.answer-card').forEach(function (b) { b.classList.remove('is-selected'); b.querySelector('.radio-ring').innerHTML = ''; });
        btn.classList.add('is-selected');
        btn.querySelector('.radio-ring').innerHTML = CHECK_SVG;
        state.answers[step.key] = btn.getAttribute('data-val');
        addTimer(goNext, 110);
      });
    });
  }

  /* 40 — MEAL PLAN PREVIEW INTERSTITIAL */
  function renderInfoMealPlan(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub center">' + esc(step.sub) + '</p>' +
      '<div class="meal-phone-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<strong style="font-size:0.95rem;">Suas Refeições (' + esc(state.answers.dieta || 'Tradicional') + ')</strong>' +
          '<span style="font-size:0.74rem;color:var(--accent-olive);font-weight:700;">1.715 kcal/dia</span>' +
        '</div>' +
        '<div class="meal-row"><div><strong>Café da Manhã</strong><small>Ovos mexidos + pão integral + café · 517 kcal · 8 min</small></div><span style="width:24px;height:24px;border-radius:50%;background:var(--status-positive);color:#050300;display:flex;align-items:center;justify-content:center;">' + CHECK_SVG + '</span></div>' +
        '<div class="meal-row"><div><strong>Almoço</strong><small>Frango grelhado + arroz + legumes · 597 kcal · 20 min</small></div><span style="color:var(--text-tertiary);font-size:0.8rem;">20 min</span></div>' +
        '<div class="meal-row"><div><strong>Jantar</strong><small>Carne magra + purê de batata-doce · 601 kcal · 25 min</small></div><span style="color:var(--text-tertiary);font-size:0.8rem;">25 min</span></div>' +
      '</div>';
    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 41 — HEIGHT WITH WORKING FT / CM TOGGLE */
  function renderHeightInput(wrap, step) {
    function draw() {
      var isCm = state.unitHeight === 'cm';
      var cmVal = shown('alturaCm') || '';
      var ftVal = cmVal ? Math.floor(cmVal / 30.48) : '';
      var inVal = cmVal ? Math.round((cmVal / 2.54) % 12) : '';

      wrap.innerHTML =
        '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
        '<div class="unit-toggle-wrap"><div class="unit-toggle">' +
          '<button type="button" class="unit-btn' + (!isCm ? ' is-active' : '') + '" data-u="ft">FT</button>' +
          '<button type="button" class="unit-btn' + (isCm ? ' is-active' : '') + '" data-u="cm">CM</button>' +
        '</div></div>' +
        (isCm
          ? '<div class="underline-field-wrap"><input type="number" inputmode="numeric" id="h-cm" class="underline-input" placeholder="Altura" value="' + cmVal + '"><span class="underline-unit">cm</span></div>' +
            '<div class="field-hint">Digite um valor entre 90 cm e 243 cm</div>'
          : '<div class="ft-in-row"><input type="number" inputmode="numeric" id="h-ft" class="underline-input" placeholder="5" value="' + ftVal + '"><span class="underline-unit">ft</span>' +
            '<input type="number" inputmode="numeric" id="h-in" class="underline-input" placeholder="9" value="' + inVal + '"><span class="underline-unit">in</span></div>' +
            '<div class="field-hint">Digite entre 3 ft e 7 ft 11 in</div>'
        ) +
        '<div class="field-error" id="h-err"></div>';

      wrap.querySelectorAll('.unit-btn').forEach(function (b) {
        b.addEventListener('click', function () { state.unitHeight = b.getAttribute('data-u'); draw(); });
      });

      function validateAndGetCm() {
        if (state.unitHeight === 'cm') {
          var v = parseFloat(wrap.querySelector('#h-cm').value);
          return (!isNaN(v) && v >= 90 && v <= 243) ? Math.round(v) : null;
        }
        var ft = parseFloat(wrap.querySelector('#h-ft').value);
        var inc = parseFloat(wrap.querySelector('#h-in').value || '0');
        var totalCm = Math.round((ft * 30.48) + (inc * 2.54));
        return (!isNaN(totalCm) && totalCm >= 90 && totalCm <= 243) ? totalCm : null;
      }

      function onInput() {
        var cm = validateAndGetCm();
        elBtnPrimary.disabled = !cm;
        if (cm) { state.answers.alturaCm = cm; wrap.querySelector('#h-err').textContent = ''; }
      }

      wrap.querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('input', onInput);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !elBtnPrimary.disabled) goNext(); });
      });

      setStickyCta({
        label: step.cta,
        disabled: !validateAndGetCm(),
        onClick: function () {
          var cm = validateAndGetCm();
          if (!cm) { wrap.querySelector('#h-err').textContent = 'Informe uma altura válida.'; return; }
          state.answers.alturaCm = cm;
          goNext();
        }
      });
    }
    draw();
  }

  /* 42 — CURRENT WEIGHT WITH LBS / KG TOGGLE + LIVE BMI FEEDBACK CARD */
  function renderWeightInput(wrap, step) {
    function draw() {
      var isKg = state.unitWeight === 'kg';
      var disp = shown('pesoKg') ? (isKg ? state.answers.pesoKg : Math.round(state.answers.pesoKg * 2.20462)) : '';
      wrap.innerHTML =
        '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
        '<div class="unit-toggle-wrap"><div class="unit-toggle">' +
          '<button type="button" class="unit-btn' + (!isKg ? ' is-active' : '') + '" data-u="lbs">LBS</button>' +
          '<button type="button" class="unit-btn' + (isKg ? ' is-active' : '') + '" data-u="kg">KG</button>' +
        '</div></div>' +
        '<div class="underline-field-wrap"><input type="number" inputmode="decimal" id="w-cur" class="underline-input" placeholder="Seu peso" value="' + disp + '"><span class="underline-unit">' + (isKg ? 'kg' : 'lbs') + '</span></div>' +
        '<div class="field-hint">' + (isKg ? 'Digite um valor entre 25 kg e 300 kg' : 'Digite um valor entre 55 lbs e 660 lbs') + '</div>' +
        '<div class="field-error" id="w-err"></div>' +
        '<div id="bmi-live-slot"></div>';

      wrap.querySelectorAll('.unit-btn').forEach(function (b) {
        b.addEventListener('click', function () { state.unitWeight = b.getAttribute('data-u'); draw(); });
      });

      var inp = wrap.querySelector('#w-cur');
      var slot = wrap.querySelector('#bmi-live-slot');

      function updateLive() {
        var raw = parseFloat((inp.value || '').replace(',', '.'));
        var kg = state.unitWeight === 'kg' ? raw : raw / 2.20462;
        var valid = !isNaN(kg) && kg >= 25 && kg <= 300;
        elBtnPrimary.disabled = !valid;
        if (!valid) { slot.innerHTML = ''; return; }
        state.answers.pesoKg = Math.round(kg * 10) / 10;
        var bmi = calcBMI(state.answers.alturaCm, state.answers.pesoKg);
        var cat = bmiCategory(bmi);
        var msg = cat.healthy
          ? 'Você está em uma ótima faixa de peso! Vamos focar em definição, massa muscular e força real.'
          : cat.key === 'under'
          ? 'Seu IMC está abaixo da média. Vamos priorizar ganho de força e massa magra com calistenia progressiva.'
          : 'Você tem um excelente espaço para evoluir. Nosso plano de 15–20 min/dia acelera a queima de gordura com segurança.';
        slot.innerHTML = '<div class="live-feedback-card ' + (cat.healthy ? 'positive' : 'warning') + '">' +
          '<strong>Seu IMC atual é ' + bmi.toFixed(1).replace('.', ',') + ' (' + cat.label.toLowerCase() + ')</strong>' +
          '<p>' + msg + '</p>' +
        '</div>';
      }

      inp.addEventListener('input', updateLive);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !elBtnPrimary.disabled) goNext(); });
      setStickyCta({ label: step.cta, disabled: true, onClick: goNext });
      updateLive();
    }
    draw();
  }

  /* 43 — GOAL WEIGHT WITH LBS / KG TOGGLE + LIVE HEALTH BENEFIT CARD */
  function renderGoalWeightInput(wrap, step) {
    function draw() {
      var isKg = state.unitWeight === 'kg';
      var disp = shown('metaKg') ? (isKg ? state.answers.metaKg : Math.round(state.answers.metaKg * 2.20462)) : '';
      wrap.innerHTML =
        '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
        '<div class="unit-toggle-wrap"><div class="unit-toggle">' +
          '<button type="button" class="unit-btn' + (!isKg ? ' is-active' : '') + '" data-u="lbs">LBS</button>' +
          '<button type="button" class="unit-btn' + (isKg ? ' is-active' : '') + '" data-u="kg">KG</button>' +
        '</div></div>' +
        '<div class="underline-field-wrap"><input type="number" inputmode="decimal" id="w-goal" class="underline-input" placeholder="Meta" value="' + disp + '"><span class="underline-unit">' + (isKg ? 'kg' : 'lbs') + '</span></div>' +
        '<div class="field-hint">Seu peso atual: ' + state.answers.pesoKg + ' kg</div>' +
        '<div id="goal-live-slot"></div>';

      wrap.querySelectorAll('.unit-btn').forEach(function (b) {
        b.addEventListener('click', function () { state.unitWeight = b.getAttribute('data-u'); draw(); });
      });

      var inp = wrap.querySelector('#w-goal');
      var slot = wrap.querySelector('#goal-live-slot');

      function updateLive() {
        var raw = parseFloat((inp.value || '').replace(',', '.'));
        var kg = state.unitWeight === 'kg' ? raw : raw / 2.20462;
        var valid = !isNaN(kg) && kg >= 30 && kg <= 250;
        elBtnPrimary.disabled = !valid;
        if (!valid) { slot.innerHTML = ''; return; }
        state.answers.metaKg = Math.round(kg * 10) / 10;
        var cur = state.answers.pesoKg || 84;
        var pctDiff = Math.round((Math.abs(cur - kg) / cur) * 100);
        if (kg < cur) {
          slot.innerHTML = '<div class="live-feedback-card positive">' +
            '<strong>Desbloqueie benefícios reais: perder ' + pctDiff + '% do seu peso</strong>' +
            '<p>Estudos mostram que reduzir de 5% a 10% do peso corporal melhora a pressão arterial, disposição, sensibilidade à insulina e saúde cardiovascular.</p>' +
          '</div>';
        } else {
          slot.innerHTML = '<div class="live-feedback-card positive">' +
            '<strong>Meta de ganho muscular: +' + Math.max(1, Math.round(kg - cur)) + ' kg de força</strong>' +
            '<p>Com progressões de calistenia militar e superávit proteico simples, você ganha volume muscular limpo treinando em casa.</p>' +
          '</div>';
        }
      }

      inp.addEventListener('input', updateLive);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !elBtnPrimary.disabled) goNext(); });
      setStickyCta({ label: step.cta, disabled: true, onClick: goNext });
      updateLive();
    }
    draw();
  }

  /* 44 — EXACT AGE WITH LIVE PERSONALIZATION CARD */
  function renderAgeInput(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<div class="underline-field-wrap" style="margin-top:26px;"><input type="number" inputmode="numeric" id="age-inp" class="underline-input" placeholder="Idade" value="' + (shown('idadeExata') || '') + '"><span class="underline-unit">anos</span></div>' +
      '<div class="field-hint">Digite um valor entre 16 e 99 anos</div>' +
      '<div id="age-live-slot"></div>';

    var inp = wrap.querySelector('#age-inp');
    var slot = wrap.querySelector('#age-live-slot');
    function updateLive() {
      var v = parseInt(inp.value, 10);
      var valid = !isNaN(v) && v >= 16 && v <= 99;
      elBtnPrimary.disabled = !valid;
      if (!valid) { slot.innerHTML = ''; return; }
      state.answers.idadeExata = v;
      slot.innerHTML = '<div class="live-feedback-card">' +
        '<strong>Pedimos sua idade para personalizar seu plano</strong>' +
        '<p>A composição corporal e o tempo de recuperação mudam com a idade. Ajustamos carga e pausas especificamente para homens de ' + v + ' anos.</p>' +
      '</div>';
    }
    inp.addEventListener('input', updateLive);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !elBtnPrimary.disabled) goNext(); });
    setStickyCta({ label: step.cta, disabled: true, onClick: goNext });
    updateLive();
  }

  /* 45 — 4-BAR ANALYSIS LOADER */
  function renderBarLoader(wrap, step) {
    var rows = ['Seu Perfil', 'Atividade', 'Estilo de Vida e Hábitos', 'Metas de Peso'];
    wrap.innerHTML =
      '<h2 class="bm-title center" style="margin-top:12px;">' + esc(step.title) + '</h2>' +
      '<div class="surface-card" style="margin-top:20px;">' +
        rows.map(function (r, i) {
          return '<div class="bar-loader-item"><div class="bar-loader-top"><span>' + r + '</span><span id="bl-t-' + i + '">0%</span></div><div class="bar-loader-track"><div class="bar-loader-fill" id="bl-f-' + i + '"></div></div></div>';
        }).join('') +
      '</div>' +
      '<div class="award-carousel">' +
        '<div class="award-slide"><div style="font-size:0.74rem;color:var(--accent-olive);font-weight:800;letter-spacing:0.08em;">MÉTODO VALIDADO</div><strong style="display:block;font-size:1.05rem;margin:6px 0;">Treino de Aço · Calistenia</strong><small style="color:var(--text-tertiary);">Protocolo guiado em casa para homens</small></div>' +
        '<div class="award-slide"><div style="font-size:0.74rem;color:var(--status-positive);font-weight:800;letter-spacing:0.08em;">★★★★★ 4,8 / 5</div><strong style="display:block;font-size:1.05rem;margin:6px 0;">Aprovado por milhares de alunos</strong><small style="color:var(--text-tertiary);">Resultados consistentes sem academia</small></div>' +
      '</div>';

    rows.forEach(function (_, i) {
      addTimer(function () {
        var p = 0;
        var iv = setInterval(function () {
          p = Math.min(100, p + 12);
          var f = wrap.querySelector('#bl-f-' + i);
          var t = wrap.querySelector('#bl-t-' + i);
          if (f) f.style.width = p + '%';
          if (t) t.innerHTML = p >= 100 ? '<span style="color:var(--status-positive);">✓</span>' : p + '%';
          if (p >= 100) clearInterval(iv);
        }, 55);
        state.timers.push(iv);
      }, i * 520);
    });

    addTimer(goNext, 2600);
  }

  /* 46 — WELLNESS & BMI PROFILE SUMMARY (EXACT step_119.png!) */
  function renderBmiWellness(wrap, step) {
    var bmi = calcBMI(state.answers.alturaCm, state.answers.pesoKg);
    var cat = bmiCategory(bmi);
    // Piecewise-map BMI to the 4 equal visual scale zones: 15-18.5 (0-25%), 18.5-25 (25-50%), 25-30 (50-75%), 30-40 (75-100%)
    var pct;
    if (bmi <= 18.5) pct = ((bmi - 15) / 3.5) * 25;
    else if (bmi <= 25) pct = 25 + ((bmi - 18.5) / 6.5) * 25;
    else if (bmi <= 30) pct = 50 + ((bmi - 25) / 5) * 25;
    else pct = 75 + ((bmi - 30) / 10) * 25;
    pct = Math.max(6, Math.min(94, pct));
    var soma = state.answers.variacaoPeso || 'Mesomorfo';
    var metab = soma === 'Ectomorfo' ? 'Acelerado' : soma === 'Endomorfo' ? 'Lento, tende a acumular gordura' : 'Moderado, responde rápido ao treino';
    var riskText = cat.healthy
      ? 'Seu IMC está na faixa saudável! Manter massa muscular ativa e baixa gordura visceral protege sua energia e saúde a longo prazo.'
      : 'Com um IMC de ' + bmi.toFixed(1).replace('.', ',') + ', o peso extra está sobrecarregando suas articulações e freando sua produção de testosterona. Pressão alta, maior risco cardiovascular, resistência à insulina e fadiga constante.';

    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<div class="bmi-panel">' +
        '<div style="font-size:1.05rem;font-weight:700;margin-bottom:4px;">Índice de Massa Corporal (IMC)</div>' +
        '<div class="bmi-callout-area"><div class="bmi-pill-float" style="left:' + pct + '%;">Você - ' + bmi.toFixed(2).replace('.', ',') + '</div></div>' +
        '<div class="bmi-scale-nums"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div>' +
        '<div class="bmi-rainbow-wrap"><div class="bmi-rainbow"></div><div class="bmi-dot" style="left:' + pct + '%;"></div></div>' +
        '<div class="bmi-cats">' +
          '<span class="' + (cat.key === 'under' ? 'active' : '') + '">ABAIXO</span>' +
          '<span class="' + (cat.key === 'normal' ? 'active' : '') + '">NORMAL</span>' +
          '<span class="' + (cat.key === 'over' ? 'active' : '') + '">SOBREPESO</span>' +
          '<span class="' + (cat.key === 'obese' ? 'active' : '') + '">OBESIDADE</span>' +
        '</div>' +
        '<div class="bmi-risk-box">' +
          '<strong><span>' + (cat.healthy ? '✓' : '!') + '</span> ' + (cat.healthy ? 'Faixa saudável de IMC:' : 'Riscos de IMC fora do ideal:') + '</strong>' +
          '<p>' + riskText + '</p>' +
        '</div>' +
        '<div class="bmi-bottom-split">' +
          '<div class="bmi-attr-list">' +
            '<div class="bmi-attr-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg><div><small>Biotipo</small><strong>' + esc(soma) + ' <button type="button" class="info-i-btn" id="btn-soma-info" aria-label="Sobre o biotipo">i</button></strong></div></div>' +
            '<div class="bmi-attr-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 19v-7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7M4 15h16M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/></svg><div><small>Estilo de vida</small><strong>' + esc(state.answers.diaTipico || 'Sedentário') + '</strong></div></div>' +
            '<div class="bmi-attr-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c.5 4-2 6-2 9a4 4 0 1 0 8 0c0-3-2-5-2-9-1 2-2.5 3-4 0z"/></svg><div><small>Metabolismo</small><strong>' + metab + '</strong></div></div>' +
            '<div class="bmi-attr-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3h6M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3"/></svg><div><small>🧪 Nível de testosterona</small><strong>Abaixo do normal</strong></div></div>' +
          '</div>' +
          '<div class="bmi-avatar-right"><img src="' + getAvatarByBuild() + '" alt="Seu perfil físico"></div>' +
        '</div>' +
      '</div>';

    wrap.querySelector('#btn-soma-info').addEventListener('click', function () {
      openInfoModal(
        'Seu biotipo: ' + soma,
        'O biotipo indica como seu corpo tende a responder ao treino e à alimentação. No <strong>Treino de Aço</strong>, ajustamos o volume de séries e pausas para extrair o melhor resultado do perfil ' + soma + '.',
        'ENTENDI'
      );
    });

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 49 — CUSTOM DARK CALENDAR PICKER (PT-BR) */
  function renderCalendarPicker(wrap, step) {
    var selDate = shown('eventoData') ? new Date(state.answers.eventoData) : null;
    var viewBase = selDate || getTodayPlusDays(90);
    var viewYear = viewBase.getFullYear();
    var viewMonth = viewBase.getMonth();
    var open = true;

    function drawCal() {
      var firstDay = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var today = new Date(); today.setHours(0, 0, 0, 0);

      var cells = '';
      for (var e = 0; e < firstDay; e++) cells += '<span></span>';
      for (var d = 1; d <= daysInMonth; d++) {
        var dt = new Date(viewYear, viewMonth, d);
        var isPast = dt < today;
        var isSel = !!selDate && dt.getFullYear() === selDate.getFullYear() && dt.getMonth() === selDate.getMonth() && dt.getDate() === selDate.getDate();
        cells += '<button type="button" class="cal-day' + (isSel ? ' is-selected' : '') + '" data-day="' + d + '" ' + (isPast ? 'disabled' : '') + '>' + d + '</button>';
      }

      wrap.innerHTML =
        '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
        '<p class="bm-sub center">' + esc(step.sub) + '</p>' +
        '<button type="button" class="date-trigger-btn" id="cal-toggle">' +
          '<span>' + (selDate ? fmtDateFull(selDate) : 'Escolha a data') + '</span>' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>' +
        '</button>' +
        (open ? (
          '<div class="calendar-popup">' +
            '<div class="cal-head">' +
              '<button type="button" class="cal-nav-btn" id="cal-prev">&lsaquo;</button>' +
              '<strong>' + MONTHS_FULL[viewMonth] + ' ' + viewYear + '</strong>' +
              '<button type="button" class="cal-nav-btn" id="cal-next">&rsaquo;</button>' +
            '</div>' +
            '<div class="cal-grid">' +
              '<span class="cal-dow">Dom</span><span class="cal-dow">Seg</span><span class="cal-dow">Ter</span><span class="cal-dow">Qua</span><span class="cal-dow">Qui</span><span class="cal-dow">Sex</span><span class="cal-dow">Sáb</span>' +
              cells +
            '</div>' +
          '</div>'
        ) : '') +
        '<p style="text-align:center;font-size:0.78rem;color:var(--text-tertiary);">' + LOCK_SVG + 'Seus dados são processados conforme nossa <a href="legal/privacidade.html">Política de Privacidade</a>.</p>';

      wrap.querySelector('#cal-toggle').addEventListener('click', function () { open = !open; drawCal(); });
      if (open) {
        wrap.querySelector('#cal-prev').addEventListener('click', function () {
          viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } drawCal();
        });
        wrap.querySelector('#cal-next').addEventListener('click', function () {
          viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } drawCal();
        });
        wrap.querySelectorAll('.cal-day:not(:disabled)').forEach(function (btn) {
          btn.addEventListener('click', function () {
            selDate = new Date(viewYear, viewMonth, parseInt(btn.getAttribute('data-day'), 10));
            state.answers.eventoData = selDate;
            drawCal();
            elBtnPrimary.disabled = false;
          });
        });
      }
    }

    drawCal();
    setStickyCta({
      label: step.cta,
      disabled: !selDate,
      onClick: function () { if (!selDate) return; state.answers.eventoData = selDate; goNext(); },
      skipLabel: step.skipLabel,
      onSkip: function () { state.answers.eventoData = null; goNext(); }
    });
  }

  /* 50 — WEIGHT PROJECTION GRADIENT SVG + EXPERT QUOTE CARD */
  function renderProjectionQuote(wrap, step) {
    var goalDate = getEstimatedGoalDate();
    var wStart = state.answers.pesoKg || 84;
    var wEnd = state.answers.metaKg || 75;
    var losing = wEnd <= wStart;
    var y1 = losing ? 42 : 122;
    var y2 = losing ? 122 : 42;
    var midMonth = MONTHS_SHORT[(new Date().getMonth() + 1) % 12];
    var hasEvent = state.answers.eventoFuturo && state.answers.eventoFuturo !== 'Nenhum evento';

    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub center">Estimamos que você pode chegar a <strong>' + wEnd + ' kg até ' + fmtDateFull(goalDate) + '*</strong></p>' +
      (hasEvent ? '<div style="text-align:center;"><span class="event-pill">🎯 Bem a tempo para: ' + esc(state.answers.eventoFuturo) + '</span></div>' : '') +
      '<div class="surface-card">' +
        '<svg viewBox="0 0 340 175" width="100%" style="display:block;height:auto;">' +
          '<defs><linearGradient id="projGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#EE505A"/><stop offset="50%" stop-color="#FFE600"/><stop offset="100%" stop-color="#30E3B7"/></linearGradient></defs>' +
          '<line x1="36" y1="42" x2="310" y2="42" stroke="rgba(235,225,211,0.12)" stroke-dasharray="3 4"/>' +
          '<line x1="36" y1="82" x2="310" y2="82" stroke="rgba(235,225,211,0.12)" stroke-dasharray="3 4"/>' +
          '<line x1="36" y1="122" x2="310" y2="122" stroke="rgba(235,225,211,0.12)" stroke-dasharray="3 4"/>' +
          '<text x="26" y="' + (y1 + 4) + '" text-anchor="end" fill="rgba(235,225,211,0.56)" font-size="10">' + wStart + '</text>' +
          '<text x="26" y="' + (y2 + 4) + '" text-anchor="end" fill="rgba(235,225,211,0.56)" font-size="10">' + wEnd + '</text>' +
          '<path id="proj-curve" d="M 44 ' + y1 + ' C 130 ' + y1 + ', 205 ' + y2 + ', 296 ' + y2 + '" fill="none" stroke="url(#projGrad)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="360" stroke-dashoffset="360"/>' +
          '<circle cx="44" cy="' + y1 + '" r="6" fill="#EE505A"/>' +
          '<circle cx="296" cy="' + y2 + '" r="7" fill="#30E3B7" stroke="#050300" stroke-width="2.5"/>' +
          '<rect x="236" y="' + (y2 - 32) + '" width="92" height="22" rx="11" fill="#EBE1D3"/><text x="282" y="' + (y2 - 17) + '" text-anchor="middle" fill="#050300" font-size="10.5" font-weight="800">Meta ' + wEnd + ' kg</text>' +
          '<text x="48" y="160" text-anchor="middle" fill="rgba(235,225,211,0.6)" font-size="10">Hoje</text>' +
          '<text x="170" y="160" text-anchor="middle" fill="rgba(235,225,211,0.6)" font-size="10">' + midMonth + '</text>' +
          '<text x="292" y="160" text-anchor="middle" fill="#30E3B7" font-size="10" font-weight="700">' + fmtDateShort(goalDate) + '</text>' +
        '</svg>' +
        '<p style="margin:6px 0 0;font-size:0.7rem;color:var(--text-tertiary);text-align:center;">*Estimativa ilustrativa baseada nas suas respostas. Resultados variam de pessoa para pessoa.</p>' +
      '</div>' +
      '<div class="quote-card">' +
        '<img class="quote-avatar" src="' + step.quoteAvatar + '" alt="Coach Treino de Aço">' +
        '<p class="quote-text">' + step.quoteText + '</p>' +
        '<div style="font-size:0.74rem;color:var(--accent-olive);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Equipe Treino de Aço</div>' +
      '</div>';

    addTimer(function () {
      var p = wrap.querySelector('#proj-curve');
      p.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)';
      p.style.strokeDashoffset = '0';
    }, 140);

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 52 — ANIMATED COMPARATIVE SVG: YOUR STRENGTH */
  function renderInfoStrengthCompare(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub">' + esc(step.sub) + '</p>' +
      '<div class="surface-card">' +
        '<div style="font-size:0.9rem;font-weight:700;margin-bottom:8px;">Sua força e consistência</div>' +
        '<svg viewBox="0 0 340 185" width="100%" style="display:block;height:auto;">' +
          '<path id="cmp-without" d="M 38 134 C 115 110, 175 136, 306 146" fill="none" stroke="rgba(235,225,211,0.28)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="340" stroke-dashoffset="340"/>' +
          '<path id="cmp-with" d="M 38 134 C 120 120, 200 62, 306 34" fill="none" stroke="#888342" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="340" stroke-dashoffset="340"/>' +
          '<circle cx="38" cy="134" r="5.5" fill="#EBE1D3"/>' +
          '<circle cx="306" cy="34" r="6.5" fill="#EBE1D3" stroke="#888342" stroke-width="3"/>' +
          '<rect x="184" y="8" width="134" height="22" rx="11" fill="#888342"/><text x="251" y="23" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="700">Com o Treino de Aço</text>' +
          '<rect x="192" y="152" width="124" height="22" rx="11" fill="#12100c" stroke="rgba(235,225,211,0.2)"/><text x="254" y="167" text-anchor="middle" fill="#EBE1D3" font-size="10">Sem o plano</text>' +
          '<text x="38" y="156" text-anchor="middle" fill="rgba(235,225,211,0.6)" font-size="10">Agora</text>' +
        '</svg>' +
        '<p style="margin:6px 0 0;font-size:0.7rem;color:var(--text-tertiary);text-align:center;">Gráfico apenas ilustrativo. Seguir o treino e a alimentação faz toda a diferença.</p>' +
      '</div>';

    addTimer(function () {
      ['#cmp-with', '#cmp-without'].forEach(function (sel) {
        var el = wrap.querySelector(sel);
        el.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)';
        el.style.strokeDashoffset = '0';
      });
    }, 120);

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 54 — CONFIDENCE CHECK WITH DYNAMIC GOAL DATE */
  function renderConfidenceSingle(wrap, step) {
    var dGoal = getEstimatedGoalDate();
    var cloned = Object.assign({}, step, {
      title: 'Quão confiante você está em ' + getGoalPhraseLower() + ' até ' + fmtDateDayMonth(dGoal) + '?'
    });
    renderSingleList(wrap, cloned, false);
  }

  /* 55 — TRUST & AWARDS */
  function renderInfoAwards(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<div class="answer-stack" style="margin-top:18px;">' +
        step.awards.map(function (a) {
          return '<div class="surface-card" style="display:flex;align-items:center;gap:14px;margin-bottom:0;">' +
            '<div class="circle-icon" style="width:48px;height:48px;font-size:1.35rem;background:var(--accent-olive-light);">' + a.icon + '</div>' +
            '<div style="flex:1;"><strong style="display:block;font-size:0.94rem;">' + esc(a.title) + '</strong><small style="color:var(--text-tertiary);font-size:0.8rem;">' + esc(a.desc) + '</small></div>' +
            '<span style="font-size:0.72rem;font-weight:800;color:var(--accent-olive);">' + esc(a.year) + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 56 — CIRCULAR RING LOADER + TESTIMONIALS */
  function renderRingLoader(wrap, step) {
    var circ = 2 * Math.PI * 62;
    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<div class="ring-wrap">' +
        '<svg viewBox="0 0 146 146" width="146" height="146" style="transform:rotate(-90deg);">' +
          '<circle cx="73" cy="73" r="62" fill="none" stroke="rgba(235,225,211,0.14)" stroke-width="10"/>' +
          '<circle id="ring-prog" cx="73" cy="73" r="62" fill="none" stroke="#888342" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '"/>' +
        '</svg>' +
        '<div class="ring-pct" id="ring-num">0%</div>' +
      '</div>' +
      '<p class="bm-sub center" style="margin-bottom:14px;"><strong>Mais de 40 mil homens</strong> escolheram o Treino de Aço para ' + getGoalPhraseLower() + '</p>' +
      '<div class="award-carousel">' +
        '<div class="award-slide" style="text-align:left;"><div style="color:#3AAE92;font-size:0.9rem;margin-bottom:6px;">★★★★★</div><strong style="font-size:0.9rem;">Carlos Eduardo · 42 anos</strong><p style="margin:6px 0 0;font-size:0.8rem;color:var(--text-secondary);">"Treinos curtos que realmente cabem antes do trabalho. Em 3 semanas já senti a barriga diminuir e a postura mudar."</p></div>' +
        '<div class="award-slide" style="text-align:left;"><div style="color:#3AAE92;font-size:0.9rem;margin-bottom:6px;">★★★★★</div><strong style="font-size:0.9rem;">Rafael Mendes · 36 anos</strong><p style="margin:6px 0 0;font-size:0.8rem;color:var(--text-secondary);">"Nunca gostei de academia. Treinando em casa sem equipamento já bati 20 flexões limpas pela primeira vez."</p></div>' +
        '<div class="award-slide" style="text-align:left;"><div style="color:#3AAE92;font-size:0.9rem;margin-bottom:6px;">★★★★★</div><strong style="font-size:0.9rem;">Marcos Silva · 51 anos</strong><p style="margin:6px 0 0;font-size:0.8rem;color:var(--text-secondary);">"As dores na lombar sumiram e voltei a ter energia o dia todo. Melhor decisão que tomei este ano."</p></div>' +
      '</div>';

    var pct = 0;
    var ring = wrap.querySelector('#ring-prog');
    var num = wrap.querySelector('#ring-num');
    var iv = setInterval(function () {
      pct = Math.min(100, pct + 4);
      ring.style.strokeDashoffset = circ * (1 - pct / 100);
      num.textContent = pct + '%';
      if (pct >= 100) {
        clearInterval(iv);
        addTimer(goNext, 420);
      }
    }, 95);
    state.timers.push(iv);
  }

  /* 57 — EMAIL CAPTURE */
  function renderEmailCapture(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title center" style="margin-top:16px;">Digite seu e-mail para receber seu <span class="accent">Plano de Calistenia Militar</span> personalizado!</h2>' +
      '<div style="margin-top:22px;">' +
        '<input type="email" id="email-inp" class="email-input-box" placeholder="Seu e-mail" autocomplete="email" value="' + esc(state.answers.email) + '">' +
        '<div class="field-error" id="email-err"></div>' +
      '</div>' +
      '<p style="text-align:center;font-size:0.78rem;color:var(--text-tertiary);">' + LOCK_SVG + 'Respeitamos sua privacidade. Sem spam. <a href="legal/privacidade.html">Política de Privacidade</a>.</p>';

    var inp = wrap.querySelector('#email-inp');
    var err = wrap.querySelector('#email-err');

    function isValid() { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((inp.value || '').trim()); }
    function submitEmail() {
      if (!isValid()) { err.textContent = 'Digite um e-mail válido para continuar.'; inp.focus(); return; }
      err.textContent = '';
      state.answers.email = inp.value.trim();
      if (!IS_LOCAL) {
        try {
          fetch(CONFIG.LEAD_ENDPOINT, {
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ email: state.answers.email, nome: state.answers.nome || '', utm: getPersistedQuery().slice(0, 400) })
          }).catch(function () {});
        } catch (ex) {}
      }
      fb('track', 'Lead');
      ga('event', 'generate_lead', { currency: 'BRL', value: 0 });
      cl('event', 'lead');
      goNext();
    }

    inp.addEventListener('input', function () {
      elBtnPrimary.disabled = !isValid();
      if (isValid()) err.textContent = '';
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitEmail(); });
    setStickyCta({ label: step.cta, disabled: !isValid(), onClick: submitEmail });
  }

  /* 58 — NAME CAPTURE */
  function renderNameCapture(wrap, step) {
    wrap.innerHTML =
      '<h2 class="bm-title center" style="margin-top:24px;">' + esc(step.title) + '</h2>' +
      '<div class="underline-field-wrap" style="margin-top:34px;">' +
        '<input type="text" id="name-inp" class="underline-input" style="width:240px;font-size:1.85rem;" placeholder="Nome" autocomplete="given-name" value="' + esc(state.answers.nome) + '">' +
      '</div>';

    var inp = wrap.querySelector('#name-inp');
    function isValid() { return (inp.value || '').trim().length >= 2; }
    function submitName() {
      if (!isValid()) return;
      state.answers.nome = inp.value.trim();
      if (!IS_LOCAL && state.answers.email) {
        try {
          fetch(CONFIG.LEAD_ENDPOINT, {
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ email: state.answers.email, nome: state.answers.nome, utm: getPersistedQuery().slice(0, 400) })
          }).catch(function () {});
        } catch (ex) {}
      }
      goNext();
    }
    inp.addEventListener('input', function () { elBtnPrimary.disabled = !isValid(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && isValid()) submitName(); });
    setStickyCta({ label: step.cta, disabled: !isValid(), onClick: submitName });
  }

  /* 59 — PLAN-READY PERSONALIZED SUMMARY + ASCENDING GRAPH */
  function renderPlanReadyGraph(wrap, step) {
    var firstName = (state.answers.nome || 'Campeão').split(' ')[0];
    var sc = computeFitnessScore();
    var goalDate = getEstimatedGoalDate();
    var diffKg = Math.abs((state.answers.pesoKg || 84) - (state.answers.metaKg || 75));
    var goalVerb = (state.answers.metaKg || 75) <= (state.answers.pesoKg || 84) ? 'Perder' : 'Ganhar';

    wrap.innerHTML =
      '<h2 class="bm-title center"><span class="accent">' + esc(firstName) + ',</span> seu Plano de 4 Semanas de Calistenia Militar está pronto!</h2>' +
      '<div class="surface-card">' +
        '<div style="font-size:0.88rem;font-weight:700;margin-bottom:8px;">Evolução do seu nível físico</div>' +
        '<svg viewBox="0 0 340 165" width="100%" style="display:block;height:auto;">' +
          '<defs>' +
            '<linearGradient id="fitStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#EE505A"/><stop offset="50%" stop-color="#FFE401"/><stop offset="100%" stop-color="#54F8CF"/></linearGradient>' +
            '<linearGradient id="fitFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#54F8CF" stop-opacity="0.28"/><stop offset="100%" stop-color="#54F8CF" stop-opacity="0"/></linearGradient>' +
          '</defs>' +
          '<g stroke="rgba(235,225,211,0.12)" stroke-dasharray="3 4"><line x1="85" y1="20" x2="85" y2="138"/><line x1="160" y1="20" x2="160" y2="138"/><line x1="235" y1="20" x2="235" y2="138"/><line x1="305" y1="20" x2="305" y2="138"/></g>' +
          '<path d="M 32 126 C 110 116, 195 62, 305 28 L 305 138 L 32 138 Z" fill="url(#fitFill)"/>' +
          '<path id="fit-curve" d="M 32 126 C 110 116, 195 62, 305 28" fill="none" stroke="url(#fitStroke)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="360" stroke-dashoffset="360"/>' +
          '<circle cx="32" cy="126" r="5.5" fill="#EE505A"/>' +
          '<circle cx="305" cy="28" r="6.5" fill="#54F8CF" stroke="#050300" stroke-width="2"/>' +
          '<rect x="12" y="96" width="52" height="20" rx="10" fill="#050300" stroke="rgba(235,225,211,0.22)"/><text x="38" y="110" text-anchor="middle" fill="#EBE1D3" font-size="10" font-weight="700">Agora</text>' +
          '<text x="85" y="155" text-anchor="middle" fill="rgba(235,225,211,0.56)" font-size="10">Sem 1</text>' +
          '<text x="160" y="155" text-anchor="middle" fill="rgba(235,225,211,0.56)" font-size="10">Sem 2</text>' +
          '<text x="235" y="155" text-anchor="middle" fill="rgba(235,225,211,0.56)" font-size="10">Sem 3</text>' +
          '<text x="305" y="155" text-anchor="middle" fill="#54F8CF" font-size="10" font-weight="700">Sem 4</text>' +
        '</svg>' +
      '</div>' +
      '<div class="checklist-summary">' +
        '<div class="checklist-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>Calibrado para nível ' + sc.level + ' (' + esc(state.answers.duracaoTreino || '15-20 min') + '/dia)</span></div>' +
        '<div class="checklist-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>100% personalizado com base nas suas respostas</span></div>' +
        (querLibido() ? '<div class="checklist-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>Aumento natural de testosterona, energia e virilidade</span></div>' : '') +
        '<div class="checklist-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg><span>Meta: ' + goalVerb + ' ' + diffKg.toFixed(0) + ' kg até ' + fmtDateFull(goalDate) + '*</span></div>' +
      '</div>' +
      '<p style="font-size:0.72rem;color:var(--text-tertiary);text-align:center;margin-top:10px;">*Gráfico e prazo ilustrativos. Resultados variam conforme dedicação e alimentação.</p>';

    addTimer(function () {
      var p = wrap.querySelector('#fit-curve');
      p.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)';
      p.style.strokeDashoffset = '0';
    }, 120);

    setStickyCta({ label: step.cta, onClick: goNext });
  }

  /* 60 — START-TODAY ANIMATED OLIVE-GLOW SPLASH */
  function renderStartTodaySplash(wrap) {
    var today = new Date();
    var d28 = getTodayPlusDays(28);
    wrap.innerHTML =
      '<div class="splash-olive-stage">' +
        '<div class="splash-olive-glow"></div>' +
        '<div class="splash-phrase" id="splash-msg">Plano completo.<br>Começamos hoje, <span style="color:var(--accent-olive);">' + fmtDateDayMonth(today) + '</span></div>' +
      '</div>';

    var msg = wrap.querySelector('#splash-msg');
    addTimer(function () {
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(-10px)';
    }, 1500);
    addTimer(function () {
      msg.innerHTML = 'Até <span style="color:var(--accent-olive);">' + fmtDateDayMonth(d28) + '</span><br>você estará irreconhecível';
      msg.style.opacity = '1';
      msg.style.transform = 'translateY(0)';
    }, 1950);
    addTimer(goNext, 3500);
  }

  /* 61 — INTERACTIVE PERFORATED OLIVE SCRATCH TICKET (EXACT step_160.png!) */
  function renderScratchCard(wrap, step) {
    state.scratchRevealed = false;
    var firstName = (state.answers.nome || 'Campeão').split(' ')[0];
    var promoCode = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '') + '_50off';

    wrap.innerHTML =
      '<h2 class="bm-title center">' + esc(step.title) + '</h2>' +
      '<p class="bm-sub center">' + esc(step.sub) + '</p>' +
      '<div class="ticket-outer">' +
        '<div class="ticket-top-pane">' +
          '<div class="ticket-reveal-under">' +
            '<div class="ticket-reveal-pct">50% OFF</div>' +
            '<span>Desconto liberado no seu Plano Treino de Aço!</span>' +
          '</div>' +
          '<canvas class="ticket-canvas" id="bm-scratch-cv" width="244" height="232"></canvas>' +
          '<div class="ticket-hand-hint" id="scratch-hand">' +
            '<svg viewBox="0 0 36 36" width="38" height="38" fill="#ffffff" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.45));"><path d="M16 4a2.2 2.2 0 0 1 2.2 2.2v9.3l1.1-.4a2 2 0 0 1 2.5 1.1l.4 1.1 1-.3a2 2 0 0 1 2.5 1.2l.4 1.3.7-.2a2 2 0 0 1 2.5 1.9v3.6c0 4.8-3.8 8.7-8.7 8.7h-3.4c-3.5 0-6.5-2-8-5.1l-3.4-7a2.1 2.1 0 0 1 3.5-2.2l2.5 2.7V6.2A2.2 2.2 0 0 1 16 4z"/></svg>' +
          '</div>' +
        '</div>' +
        '<div class="ticket-notch-l"></div>' +
        '<div class="ticket-notch-r"></div>' +
        '<div class="ticket-dash-line"></div>' +
        '<div class="ticket-bottom-stub" id="ticket-stub"><span>TREINO DE AÇO</span><small style="opacity:0.75;font-weight:600;">CUPOM EXCLUSIVO</small></div>' +
      '</div>';

    var canvas = wrap.querySelector('#bm-scratch-cv');
    var ctx = canvas.getContext('2d');
    var hand = wrap.querySelector('#scratch-hand');
    var stub = wrap.querySelector('#ticket-stub');

    // Paint olive-gold scratch cover with darker olive scribble hint
    ctx.fillStyle = '#888342';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(72, 68, 30, 0.42)';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(95, 86);
    ctx.lineTo(155, 76);
    ctx.lineTo(68, 122);
    ctx.lineTo(182, 114);
    ctx.lineTo(78, 166);
    ctx.lineTo(168, 158);
    ctx.stroke();

    ctx.fillStyle = '#EBE1D3';
    ctx.font = '700 18px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Raspe aqui', canvas.width / 2, 42);

    function finishHandoff() {
      var payload = {
        nome: state.answers.nome,
        email: state.answers.email,
        idade: state.answers.idadeExata,
        alturaCm: state.answers.alturaCm,
        pesoKg: state.answers.pesoKg,
        metaKg: state.answers.metaKg,
        nivel: computeFitnessScore().level,
        objetivo: state.answers.objetivo,
        cupom: promoCode
      };
      try { localStorage.setItem('treino_de_aco_profile', JSON.stringify(payload)); } catch (e) {}
      // Ponte para a página de vendas (p54 lê 'sda': nome, email, h, w, g, anos, idade=faixa)
      try {
        var sda = JSON.parse(localStorage.getItem('sda') || '{}');
        var an = parseInt(state.answers.idadeExata, 10);
        if (state.answers.nome) sda.nome = String(state.answers.nome).trim().split(' ')[0];
        if (state.answers.email) sda.email = state.answers.email;
        if (state.answers.alturaCm) sda.h = Number(state.answers.alturaCm);
        if (state.answers.pesoKg) sda.w = Number(state.answers.pesoKg);
        if (state.answers.metaKg) sda.g = Number(state.answers.metaKg);
        if (an) { sda.anos = an; sda.idade = an < 40 ? 0 : an < 50 ? 1 : an < 60 ? 2 : 3; }
        var Q = state.answers, fs = computeFitnessScore();
        sda.porte = Q.porteFisico || ''; sda.fisico = Q.fisicoIdeal || ''; sda.objetivo = Q.objetivo || '';
        sda.nivel = fs.level; sda.intensidade = Q.intensidade || ''; sda.duracao = Q.duracaoTreino || '';
        sda.freq = Q.frequenciaSemanal || ''; sda.areas = Q.areasProblema || []; sda.metaData = getEstimatedGoalDate().getTime(); sda.libido = querLibido() ? 1 : 0;
        localStorage.setItem('sda', JSON.stringify(sda));
      } catch (e) {}

      if (CONFIG.CHECKOUT_URL) {
        var url = CONFIG.CHECKOUT_URL + getPersistedQuery();
        if (typeof window.alCheckout === 'function') url = window.alCheckout(url, '28d');
        location.href = url;
      } else {
        openInfoModal(
          'Desconto de 50% liberado (' + promoCode.toUpperCase() + ')!',
          '<strong>Funil concluído com sucesso!</strong><br><br>Os dados personalizados de <strong>' + esc(firstName) + '</strong> (' + state.answers.pesoKg + ' kg &rarr; ' + state.answers.metaKg + ' kg, nível ' + computeFitnessScore().level + ') foram salvos.<br><br><small style="color:var(--text-tertiary);">Para redirecionar automaticamente para sua página de pagamento/checkout, basta colar a URL em <code>CONFIG.CHECKOUT_URL</code> no arquivo <code>app.js</code>.</small>',
          'FECHAR'
        );
      }
    }

    function revealTicket() {
      if (state.scratchRevealed) return;
      state.scratchRevealed = true;
      hand.style.display = 'none';
      canvas.style.transition = 'opacity 0.4s ease';
      canvas.style.opacity = '0';
      stub.innerHTML = '<span>CUPOM: ' + promoCode.toUpperCase() + '</span><small style="opacity:0.85;">50% DE DESCONTO ATIVO</small>';
      elBtnPrimary.textContent = 'RESGATAR MEU DESCONTO (50% OFF)';
      elBtnPrimary.disabled = false;
    }

    var drawing = false;
    var strokes = 0;
    function scratchAt(cx, cy) {
      var rect = canvas.getBoundingClientRect();
      var x = (cx - rect.left) * (canvas.width / rect.width);
      var y = (cy - rect.top) * (canvas.height / rect.height);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
      hand.style.display = 'none';
      strokes++;
      if (strokes >= 16) revealTicket();
    }

    canvas.addEventListener('pointerdown', function (e) {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      scratchAt(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      scratchAt(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointerup', function () { drawing = false; });

    setStickyCta({
      label: 'REVELAR MEU DESCONTO AGORA',
      disabled: false,
      onClick: function () {
        if (!state.scratchRevealed) revealTicket();
        else finishHandoff();
      }
    });
  }

  /* ==================== BOOTSTRAP ==================== */
  var qsStep = parseInt(new URLSearchParams(location.search).get('step'), 10);
  if (!isNaN(qsStep) && qsStep >= 0 && qsStep < STEPS.length) {
    state.idx = qsStep;
    renderCurrentStep();
  } else {
    renderCurrentStep();
  }
})();

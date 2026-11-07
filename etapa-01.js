/* Primeira etapa: grava a faixa escolhida antes de avançar. */
(function () {
  'use strict';
  var cards = Array.from(document.querySelectorAll('[data-age-index]'));
  var error = document.getElementById('stage-one-error');
  var locked = false;
  var menu = document.querySelector('[data-test="header__burgerButton"]');
  var documents = document.getElementById('stage-one-documents');
  function closeMenu() { documents.hidden = true; menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', function () {
    var open = documents.hidden; documents.hidden = !open; menu.setAttribute('aria-expanded', String(open));
    if (open) documents.querySelector('a').focus();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', function (e) { if (!documents.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (locked) return;
      var age = Number(card.dataset.ageIndex), answers = {};
      try {
        var previous = JSON.parse(localStorage.getItem('sda') || '{}');
        if (previous && typeof previous === 'object' && !Array.isArray(previous)) answers = previous;
      } catch (_) { /* Um registro inválido é substituído por uma resposta válida. */ }
      if (answers.idade !== age) delete answers.anos;
      answers.idade = age;
      try { localStorage.setItem('sda', JSON.stringify(answers)); }
      catch (_) {
        error.textContent = 'Não foi possível guardar sua escolha. Permita o armazenamento deste site no navegador e tente novamente.';
        error.hidden = false; error.focus(); return;
      }
      locked = true;
      cards.forEach(function (b) { b.setAttribute('aria-pressed', String(b === card)); b.setAttribute('aria-disabled', 'true'); });
      // Mantém os parâmetros da visita para as etapas existentes do funil.
      window.location.assign('p01.html' + window.location.search);
    });
  });
  window.addEventListener('pageshow', function () {
    locked = false;
    cards.forEach(function (card) { card.removeAttribute('aria-disabled'); card.setAttribute('aria-pressed', 'false'); });
  });
})();

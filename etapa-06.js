/* Sexta tela: título conforme o objetivo escolhido na quinta tela. */
(function () {
  'use strict';
  var titles = [
    'Ganhar massa muscular rapidamente!',
    'Perder peso rapidamente!',
    'Perder gordura e ganhar músculos rapidamente!',
    'Ter mais força e condicionamento físico rapidamente!'
  ];
  var answers;
  try { answers = JSON.parse(localStorage.getItem('sda') || '{}'); }
  catch (_) { answers = {}; }
  var goal = answers && answers.singleSelect_21632;
  document.querySelector('[data-test="infoPage__title"]').textContent =
    Number.isInteger(goal) && titles[goal] ? titles[goal] : 'Avance em direção ao seu objetivo!';
})();

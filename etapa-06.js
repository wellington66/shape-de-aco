/* Sexta tela: título conforme o objetivo escolhido na quinta tela. */
(function () {
  'use strict';
  var titles = [
    'Perder peso e secar a barriga!',
    'Ganhar força e músculos!',
    'Mais saúde e disposição!'
  ];
  var answers;
  try { answers = JSON.parse(localStorage.getItem('sda') || '{}'); }
  catch (_) { answers = {}; }
  var goal = answers && answers.singleSelect_21632;
  document.querySelector('[data-test="infoPage__title"]').textContent =
    Number.isInteger(goal) && titles[goal] ? titles[goal] : 'Avance em direção ao seu objetivo!';
})();

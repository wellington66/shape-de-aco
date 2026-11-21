/* Sexta tela: título conforme o objetivo escolhido na quinta tela. */
(function () {
  'use strict';
  var titles = [
    'Ganhar músculo sem passar horas na academia',
    'Secar a barriga com 15 minutos por dia',
    'Perder gordura e ganhar músculo ao mesmo tempo',
    'Ganhar força e energia para o dia a dia'
  ];
  var answers;
  try { answers = JSON.parse(localStorage.getItem('sda') || '{}'); }
  catch (_) { answers = {}; }
  var goal = answers && answers.singleSelect_21632;
  document.querySelector('[data-test="infoPage__title"]').textContent =
    Number.isInteger(goal) && titles[goal] ? titles[goal] : 'Seu plano de 28 dias está sendo montado';
})();

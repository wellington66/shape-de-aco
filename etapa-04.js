/* Quarta tela: usa a resposta da terceira tela, mantida no original. */
(function () {
  'use strict';
  var answers;
  try { answers = JSON.parse(localStorage.getItem('sda') || '{}'); }
  catch (_) { answers = {}; }
  var experience = answers && answers.singleSelect_21631;
  var experienced = experience === 0;
  var title = document.querySelector('[data-test="infoPage__title"]');
  var copy = document.getElementById('sda-experience-copy');
  title.textContent = experienced ? 'Mais força e definição, sem academia.' : 'Comece do zero. Construa um corpo mais forte.';
  copy.textContent = experienced
    ? 'O Desafio Força de Aço funciona para todos os níveis. A partir daqui, vamos conhecer seu nível atual e o que você quer conquistar com os treinos.'
    : 'O Desafio Força de Aço funciona para todos os níveis. Conheça seu ponto de partida e avance no seu ritmo.';
  // No acesso direto, evita presumir experiência ou ausência dela.
  if (experience !== 0 && experience !== 1) {
    title.textContent = 'Você vai arrasar!';
    copy.textContent = 'O Desafio Força de Aço funciona para todos os níveis, do iniciante ao avançado.';
  }
})();

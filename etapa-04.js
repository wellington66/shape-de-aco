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
  title.textContent = experienced ? 'Não foi falta de esforço. Foi o método.' : 'Você começa do jeito certo.';
  copy.textContent = experienced
    ? 'Horas em um aparelho de cada vez cansam o corpo e pouco mudam a barriga. A calistenia militar usa o corpo inteiro de uma vez: 15 minutos por dia, em casa.'
    : 'Você não precisa de academia nem de esteira. Com calistenia militar o corpo inteiro treina em 15 minutos por dia, em casa e no seu ritmo.';
  // No acesso direto, evita presumir experiência ou ausência dela.
  if (experience !== 0 && experience !== 1) {
    title.textContent = 'Você começa do jeito certo.';
    copy.textContent = 'O Desafio Treino de Aço funciona para todos os níveis, do iniciante ao avançado.';
  }
})();

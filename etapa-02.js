/* A faixa de idade vem da escolha feita na primeira tela. */
(function () {
  'use strict';
  var ranges = ['18 a 29 anos', '30 a 39 anos', '40 a 49 anos', '50 anos ou mais'];
  var answers;
  try { answers = JSON.parse(localStorage.getItem('sda') || '{}'); }
  catch (_) { answers = {}; }
  var age = answers && answers.idade;
  var range = Number.isInteger(age) ? ranges[age] : null;
  document.getElementById('sda-etapa-02-faixa').textContent = range ? 'homens de ' + range : 'homens adultos';
})();

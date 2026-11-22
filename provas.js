/* Provas sociais da página de vendas (p54): pontos dos carrosséis e ampliar a imagem ao tocar. Não mexe em pixel nem em checkout. */
(function(){'use strict';
function init(){
  document.querySelectorAll('.pv-car').forEach(function(c){
    var tr=c.querySelector('.pv-track'),sl=[].slice.call(c.querySelectorAll('.pv-slide')),d=c.querySelector('.pv-dots');
    if(!tr||!d)return; d.innerHTML=sl.map(function(){return '<i></i>'}).join('');
    var dots=[].slice.call(d.children);
    function up(){var m=tr.scrollLeft+tr.clientWidth/2,best=0,bd=1e9;sl.forEach(function(s,i){var dd=Math.abs(s.offsetLeft+s.offsetWidth/2-m);if(dd<bd){bd=dd;best=i}});dots.forEach(function(x,i){x.className=i===best?'on':''})}
    tr.addEventListener('scroll',function(){window.requestAnimationFrame(up)},{passive:true});up();
  });
  var lb=document.createElement('div');lb.id='pv-lb';lb.innerHTML='<img alt=""><button type="button" aria-label="Fechar">&times;</button>';document.body.appendChild(lb);
  var li=lb.querySelector('img');
  document.addEventListener('click',function(e){var t=e.target;
    if(t.classList&&t.classList.contains('pv-zoom')){li.src=t.src;li.alt=t.alt;lb.classList.add('on')}
    else if(lb.classList.contains('on')){lb.classList.remove('on')}
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

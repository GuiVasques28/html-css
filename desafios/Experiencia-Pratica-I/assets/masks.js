// masks.js - pequenas máscaras para CPF, telefone e CEP
(function(){
  'use strict';

  function onlyDigits(value){ return value.replace(/\D/g,''); }

  function maskCPF(v){
    v = onlyDigits(v).slice(0,11);
    if(v.length <= 3) return v;
    if(v.length <= 6) return `${v.slice(0,3)}.${v.slice(3)}`;
    if(v.length <= 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9,11)}`;
  }

  function maskPhone(v){
    v = onlyDigits(v).slice(0,11);
    if(v.length <= 2) return `(${v}`;
    if(v.length <= 6) return `(${v.slice(0,2)}) ${v.slice(2)}`;
    if(v.length <= 10) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7,11)}`;
  }

  function maskCEP(v){
    v = onlyDigits(v).slice(0,8);
    if(v.length <= 5) return v;
    return `${v.slice(0,5)}-${v.slice(5)}`;
  }

  function attachMask(selector, masker){
    const el = document.querySelector(selector);
    if(!el) return;
    el.addEventListener('input', function(ev){
      const pos = el.selectionStart;
      const old = el.value;
      const newVal = masker(old);
      el.value = newVal;
      // tenta restaurar caret em lugar decente (simples)
      try { el.setSelectionRange(newVal.length, newVal.length); } catch(e){}
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    attachMask('#cpf', maskCPF);
    attachMask('#telefone', maskPhone);
    attachMask('#cep', maskCEP);
  });
})();

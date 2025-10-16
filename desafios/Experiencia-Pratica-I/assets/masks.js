

const APIUrl = 'https://viacep.com.br/ws/01001000/json/';

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
      const old = el.value;
      const newVal = masker(old);
      el.value = newVal;

      // tenta restaurar caret em lugar decente (simples)
      try { el.setSelectionRange(newVal.length, newVal.length); } catch(e){}

      // Se for o campo CEP e o valor estiver completo (8 dígitos)
      if(selector === '#cep'){
        const cep = onlyDigits(newVal);
        if(cep.length === 8){
          buscarCEP(cep);
        }
      }
    });
  }

  // Função para buscar dados do CEP usando a API ViaCEP
  function buscarCEP(cep){
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if(data.erro) return;
        // Preenche automaticamente os campos se existirem no formulário
        if(document.querySelector('#endereco')) document.querySelector('#endereco').value = data.logradouro || '';
        if(document.querySelector('#bairro')) document.querySelector('#bairro').value = data.bairro || '';
        if(document.querySelector('#cidade')) document.querySelector('#cidade').value = data.localidade || '';
        if(document.querySelector('#estado')) document.querySelector('#estado').value = data.uf || '';
      })
      .catch(err => console.error('Erro ao buscar CEP:', err));
  }

  document.addEventListener('DOMContentLoaded', function(){
    attachMask('#cpf', maskCPF);
    attachMask('#telefone', maskPhone);
    attachMask('#cep', maskCEP);
  });
})();

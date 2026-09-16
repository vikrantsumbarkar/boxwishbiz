(function(){
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
  const qty=document.querySelector('[name="approx_quantity"]');
  const budget=document.querySelector('[name="budget_per_piece"]');
  const total=document.querySelector('[name="expected_order_value"]');
  function calc(){const q=Number(qty&&qty.value)||0,b=Number(budget&&budget.value)||0;if(total) total.value=q&&b?(q*b).toFixed(2):'';}
  [qty,budget].forEach(x=>x&&x.addEventListener('input',calc));calc();

  const source=document.getElementById('leadSource');
  const field=document.getElementById('referralField');
  const input=document.getElementById('referralName');
  const list=document.getElementById('referralClients');
  const match=document.getElementById('referralMatch');
  const clients=read('boxwishCrmClients');
  if(list){
    clients.forEach(c=>{
      const names=[c.company,c.contact_person].filter(Boolean);
      names.forEach(n=>{const o=document.createElement('option');o.value=n;list.appendChild(o)});
    });
  }
  function toggle(){if(!source||!field)return;field.style.display=source.value==='Referral'?'block':'none';if(source.value!=='Referral'){if(input)input.value='';if(match)match.textContent='';}}
  function findReferral(){
    if(!input||!match)return;
    const v=input.value.trim().toLowerCase();
    const c=clients.find(x=>[x.company,x.contact_person,x.mobile,x.email].filter(Boolean).some(n=>String(n).toLowerCase()===v));
    if(c){input.dataset.clientId=c.client_id||'';match.textContent='✓ Existing client found: '+(c.company||c.contact_person)+' · '+(c.client_id||'');}
    else {delete input.dataset.clientId;match.textContent=v?'New referral — name/company will be recorded.':'';}
  }
  if(source){source.addEventListener('change',toggle);toggle();}
  if(input){input.addEventListener('input',findReferral);input.addEventListener('change',findReferral);}

  const form=document.getElementById('enquiryForm');
  if(form)form.addEventListener('submit',function(){
    if(input){
      let hidden=document.getElementById('referralClientId');
      if(!hidden){hidden=document.createElement('input');hidden.type='hidden';hidden.name='referral_client_id';hidden.id='referralClientId';form.appendChild(hidden);}
      hidden.value=input.dataset.clientId||'';
    }
  });
})();
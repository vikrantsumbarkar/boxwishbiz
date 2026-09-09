(function(){
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const id=new URLSearchParams(location.search).get('id');
  const e=read('boxwishCrmEnquiries').find(x=>x.enquiry_id===id); if(!e)return;
  let user={};try{user=JSON.parse(sessionStorage.getItem('crmDevUser')||'{}')}catch(err){}
  const owner=e.assigned_to||e.created_by||'Employee';
  const name=e.assigned_to_name||e.created_by_name||owner;
  const grid=document.querySelector('.detail-grid'); if(!grid)return;
  const card=document.createElement('div'); card.className='detail-card'; card.innerHTML=`<h3>Assignment</h3><div class="detail-row"><div class="field"><span>Handled By / Salesperson</span><strong>${esc(name)}</strong></div><div class="field"><span>Employee ID</span><strong>${esc(owner)}</strong></div></div>`;grid.insertBefore(card,grid.children[2]||null);
  const photos=Array.isArray(e.product_images)?e.product_images:[];
  const pcard=document.createElement('div');pcard.className='detail-card';pcard.style.gridColumn='1/-1';pcard.innerHTML=`<h3>Product Reference Photos <small style="font-weight:500;color:var(--muted)">(${photos.length}/10)</small></h3>${photos.length?`<div style="display:grid;grid-template-columns:repeat(5,minmax(100px,1fr));gap:12px">${photos.slice(0,10).map((p,i)=>`<a href="${p.data}" target="_blank" rel="noopener"><img src="${p.data}" alt="Product reference ${i+1}" style="width:100%;aspect-ratio:1;object-fit:cover;border:1px solid var(--line);border-radius:10px"></a>`).join('')}</div>`:'<p class="muted">No product reference photos uploaded.</p>'}`;grid.appendChild(pcard);
  const top=document.querySelector('.user-chip');if(top){top.querySelector('strong').textContent=user.name||e.assigned_to_name||owner||'Employee';top.querySelector('small').textContent=user.role||'Sales'}
})();
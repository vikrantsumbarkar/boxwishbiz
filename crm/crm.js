const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const pageTitle = document.getElementById('pageTitle');
const toast = document.getElementById('toast');

const pageNames = { dashboard:'Dashboard', enquiries:'Enquiries', clients:'Clients', quotations:'Quotations', fir:'FIR', lpa:'LPA', sas:'SAS', orders:'Orders', followups:'Follow Ups', documents:'Documents', profile:'Profile' };
const enquiryStatuses = ['Open','Qualified','Quotation Sent','Negotiation','Won','Lost'];
const leadSources = ['Website','Referral','LinkedIn','Cold Call','Email Campaign','Exhibition','Google Ads','Social Media','Other'];
const priorities = ['Low','Medium','High','Urgent'];
const giftingTypes = ['Corporate Gifting','Wedding Gifting','Personalised Gifting','Event Merchandise','Not sure yet'];

function showToast(message){ toast.textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2200); }
function getEnquiries(){ try{return JSON.parse(localStorage.getItem('boxwishCrmEnquiries')||'[]')}catch{return[]} }
function saveEnquiries(items){localStorage.setItem('boxwishCrmEnquiries',JSON.stringify(items));}
function money(value){return value ? '₹'+Number(value).toLocaleString('en-IN') : '—';}
function esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function formatDate(value){if(!value)return '—'; return new Date(value+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});}
function today(){return new Date().toISOString().slice(0,10);}
function makeInquiryId(){const d=today().replaceAll('-',''); const items=getEnquiries(); const count=items.filter(x=>x.enquiry_id?.startsWith('BW-INQ-'+d+'-')).length+1; return `BW-INQ-${d}-${String(count).padStart(3,'0')}`;}

function navigate(page){
  const target=pageNames[page]?page:'dashboard';
  document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active-page',el.id===target));
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===target));
  pageTitle.textContent=pageNames[target]; history.replaceState(null,'',`#${target}`); sidebar.classList.remove('open');
  if(target==='enquiries') renderEnquiries();
  if(target==='dashboard') renderDashboard();
}
function openApp(user){loginView.classList.add('hidden');appView.classList.remove('hidden');document.getElementById('userName').textContent=user.name;document.getElementById('userRole').textContent=user.role;document.getElementById('profileId').textContent=user.id;document.getElementById('profileName').textContent=user.name;document.getElementById('profileRole').textContent=user.role;navigate(location.hash.replace('#','')||'dashboard');}

loginForm.addEventListener('submit',e=>{e.preventDefault();const id=document.getElementById('employeeId').value.trim(),password=document.getElementById('password').value;if(!id||!password)return;const user={id,name:id,role:'Sales'};sessionStorage.setItem('crmDevUser',JSON.stringify(user));openApp(user);showToast('Signed in (development mode)');});
logoutBtn.addEventListener('click',()=>{sessionStorage.removeItem('crmDevUser');appView.classList.add('hidden');loginView.classList.remove('hidden');loginForm.reset();history.replaceState(null,'','#dashboard');showToast('Signed out');});
menuBtn.addEventListener('click',()=>sidebar.classList.toggle('open'));
window.addEventListener('hashchange',()=>{if(!appView.classList.contains('hidden'))navigate(location.hash.replace('#',''));});

document.addEventListener('click',e=>{
  const pageLink=e.target.closest('[data-page]'); if(pageLink){e.preventDefault();navigate(pageLink.dataset.page);return;}
  const action=e.target.closest('[data-action]'); if(!action)return;
  if(action.dataset.action==='new-enquiry') openEnquiryForm();
  if(action.dataset.action==='close-modal') closeEnquiryForm();
  if(action.dataset.action==='delete-enquiry') deleteEnquiry(action.dataset.id);
  if(action.dataset.action==='edit-enquiry') openEnquiryForm(action.dataset.id);
});

function openEnquiryForm(id=null){
  const existing=getEnquiries().find(x=>x.enquiry_id===id);
  const data=existing||{enquiry_id:makeInquiryId(),inquiry_date:today(),status:'Open',priority:'Medium',lead_source:'Website',gifting_type:'Corporate Gifting',branding_required:'Yes'};
  const modal=document.createElement('div'); modal.id='enquiryModal'; modal.className='modal-backdrop';
  modal.innerHTML=`<div class="modal-card enquiry-modal"><div class="modal-head"><div><div class="eyebrow">${existing?'Edit Enquiry':'New Enquiry'}</div><h2>${existing?'Update enquiry':'Create enquiry'}</h2><p>Inquiry ID <strong>${esc(data.enquiry_id)}</strong> is generated by CRM.</p></div><button class="icon-btn" data-action="close-modal">×</button></div>
  <form id="enquiryForm" class="form-grid"><input type="hidden" name="enquiry_id" value="${esc(data.enquiry_id)}">
  <div class="form-section"><h3>Client Details</h3><div class="form-cols"><label>Company Name *<input name="company" required value="${esc(data.company)}" placeholder="Company name"></label><label>Contact Person *<input name="contact_person" required value="${esc(data.contact_person)}" placeholder="Contact person"></label><label>Mobile *<input name="mobile" required value="${esc(data.mobile)}" placeholder="10-digit mobile"></label><label>Email<input type="email" name="email" value="${esc(data.email)}" placeholder="name@company.com"></label><label>Designation<input name="designation" value="${esc(data.designation)}" placeholder="e.g. HR Manager"></label><label>Department<input name="department" value="${esc(data.department)}" placeholder="e.g. HR / Procurement"></label><label>City<input name="city" value="${esc(data.city)}" placeholder="City"></label><label>Industry<input name="industry" value="${esc(data.industry)}" placeholder="Industry"></label></div></div>
  <div class="form-section"><h3>Requirement</h3><div class="form-cols"><label>Gifting Type *<select name="gifting_type" required>${giftingTypes.map(x=>`<option ${data.gifting_type===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Product Category *<input name="product_category" required value="${esc(data.product_category)}" placeholder="Bags, bottles, trophies, kits…"></label><label>Approx. Quantity<input type="number" min="0" name="approx_quantity" value="${esc(data.approx_quantity)}" placeholder="e.g. 100"></label><label>Budget / Piece (₹)<input type="number" min="0" step="0.01" name="budget_per_piece" value="${esc(data.budget_per_piece)}" placeholder="e.g. 750"></label><label>Expected Order Value (₹)<input type="number" min="0" step="0.01" name="expected_order_value" value="${esc(data.expected_order_value)}" placeholder="Estimated value"></label><label>Expected Delivery Date<input type="date" name="expected_delivery_date" value="${esc(data.expected_delivery_date)}"></label><label>Branding Required<select name="branding_required"><option ${data.branding_required==='Yes'?'selected':''}>Yes</option><option ${data.branding_required==='No'?'selected':''}>No</option><option ${data.branding_required==='To be decided'?'selected':''}>To be decided</option></select></label><label>Lead Source<select name="lead_source">${leadSources.map(x=>`<option ${data.lead_source===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Priority<select name="priority">${priorities.map(x=>`<option ${data.priority===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Status<select name="status">${enquiryStatuses.map(x=>`<option ${data.status===x?'selected':''}>${x}</option>`).join('')}</select></label></div><label>Product / Requirement Details<textarea name="product_details" rows="3" placeholder="Describe products, quantity split, colours, specifications, packaging, etc.">${esc(data.product_details)}</textarea><label>Discussion Notes<textarea name="discussion_notes" rows="3" placeholder="Meeting / call notes, client expectations, important details…">${esc(data.discussion_notes)}</textarea></label></div>
  <div class="modal-actions"><button type="button" class="btn secondary" data-action="close-modal">Cancel</button><button class="btn primary" type="submit">${existing?'Save Changes':'Create Enquiry'}</button></div></form></div>`;
  document.body.appendChild(modal);
  modal.querySelector('input[name="company"]').focus();
  modal.querySelector('#enquiryForm').addEventListener('submit',saveEnquiry);
}
function closeEnquiryForm(){document.getElementById('enquiryModal')?.remove();}
function saveEnquiry(e){e.preventDefault();const fd=new FormData(e.target),obj=Object.fromEntries(fd.entries());obj.approx_quantity=Number(obj.approx_quantity)||0;obj.budget_per_piece=Number(obj.budget_per_piece)||0;obj.expected_order_value=Number(obj.expected_order_value)||0;obj.updated_at=new Date().toISOString();let items=getEnquiries(),idx=items.findIndex(x=>x.enquiry_id===obj.enquiry_id);if(idx>=0){obj.created_at=items[idx].created_at||obj.updated_at;items[idx]=obj;showToast('Enquiry updated');}else{obj.created_at=obj.updated_at;items.unshift(obj);showToast(`${obj.enquiry_id} created`);}saveEnquiries(items);closeEnquiryForm();renderEnquiries();renderDashboard();}
function deleteEnquiry(id){if(!confirm('Delete this enquiry?'))return;saveEnquiries(getEnquiries().filter(x=>x.enquiry_id!==id));renderEnquiries();renderDashboard();showToast('Enquiry deleted');}
function statusClass(status){return 'status-'+status.toLowerCase().replaceAll(' ','-');}
function renderEnquiries(){const page=document.getElementById('enquiries');if(!page)return;const items=getEnquiries();const panel=page.querySelector('.panel');if(!panel)return;panel.innerHTML=`<div class="toolbar enquiry-toolbar"><input id="enquirySearch" placeholder="Search company, contact, ID or mobile…"><select id="enquiryStatus"><option>All Statuses</option>${enquiryStatuses.map(x=>`<option>${x}</option>`).join('')}</select><button class="btn secondary" data-action="new-enquiry">+ New Enquiry</button></div><div id="enquiryTable"></div>`;const paint=()=>{const q=document.getElementById('enquirySearch').value.toLowerCase(),s=document.getElementById('enquiryStatus').value;const filtered=items.filter(x=>(!q||[x.enquiry_id,x.company,x.contact_person,x.mobile].join(' ').toLowerCase().includes(q))&&(!s||s==='All Statuses'||x.status===s));document.getElementById('enquiryTable').innerHTML=filtered.length?`<div class="table-wrap"><table><thead><tr><th>Inquiry ID</th><th>Client</th><th>Requirement</th><th>Qty</th><th>Delivery</th><th>Status</th><th>Priority</th><th></th></tr></thead><tbody>${filtered.map(x=>`<tr><td><strong>${esc(x.enquiry_id)}</strong><small>${formatDate(x.inquiry_date)}</small></td><td><strong>${esc(x.company)}</strong><small>${esc(x.contact_person)} · ${esc(x.mobile)}</small></td><td>${esc(x.product_category)}<small>${esc(x.gifting_type)}</small></td><td>${x.approx_quantity||'—'}</td><td>${formatDate(x.expected_delivery_date)}</td><td><span class="status ${statusClass(x.status)}">${esc(x.status)}</span></td><td>${esc(x.priority)}</td><td class="row-actions"><button class="link-btn" data-action="edit-enquiry" data-id="${esc(x.enquiry_id)}">Edit</button><button class="link-btn danger" data-action="delete-enquiry" data-id="${esc(x.enquiry_id)}">Delete</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="table-empty">No enquiry records match your search.<br><button class="btn secondary" data-action="new-enquiry">Create Enquiry</button></div>';};paint();document.getElementById('enquirySearch').addEventListener('input',paint);document.getElementById('enquiryStatus').addEventListener('change',paint);}
function renderDashboard(){const items=getEnquiries();const stats=document.querySelectorAll('#dashboard .stat strong');if(!stats.length)return;const open=items.filter(x=>!['Won','Lost'].includes(x.status));const won=items.filter(x=>x.status==='Won');const revenue=won.reduce((a,x)=>a+Number(x.expected_order_value||0),0);stats[0].textContent=items.length;stats[1].textContent=open.length;stats[3].textContent=money(open.reduce((a,x)=>a+Number(x.expected_order_value||0),0));stats[6].textContent=won.length;stats[7].textContent=money(revenue);const recent=document.querySelector('#dashboard .dashboard-grid .panel .empty');if(recent&&items.length)recent.outerHTML=`<div class="mini-list">${items.slice(0,5).map(x=>`<div class="mini-row"><div><strong>${esc(x.company)}</strong><small>${esc(x.enquiry_id)} · ${esc(x.product_category)}</small></div><span class="status ${statusClass(x.status)}">${esc(x.status)}</span></div>`).join('')}</div>`;}

const savedUser=sessionStorage.getItem('crmDevUser');if(savedUser){try{openApp(JSON.parse(savedUser));}catch{sessionStorage.removeItem('crmDevUser');}}
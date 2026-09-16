(function(){
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v)),now=()=>new Date().toISOString(),today=()=>new Date().toISOString().slice(0,10);
  const params=new URLSearchParams(location.search),id=params.get('enquiry')||params.get('id');
  const enquiries=read('boxwishCrmEnquiries');
  const en=enquiries.find(x=>x.enquiry_id===id);
  if(!en)return;
  const form=document.getElementById('followForm');
  if(!form)return;
  const eid=document.getElementById('enquiryId');if(eid)eid.value=en.enquiry_id;
  const cn=document.getElementById('clientName');if(cn)cn.value=(en.company||'')+' · '+(en.contact_person||'');
  const date=document.getElementById('followupDate');if(date&&!date.value){const d=new Date();d.setDate(d.getDate()+1);date.value=d.toISOString().slice(0,10)}
  form.addEventListener('submit',function(ev){
    ev.preventDefault();ev.stopImmediatePropagation();
    const fd=new FormData(form);const o=Object.fromEntries(fd.entries());
    if(!o.followup_date||!o.notes){alert('Please enter Follow-up Date and Notes / Next Action.');return;}
    let user={};try{user=JSON.parse(sessionStorage.getItem('crmDevUser')||'{}')}catch(e){}
    const who=user.name||user.id||o.assigned_to||'Employee';
    o.enquiry_id=en.enquiry_id;o.followup_id='BW-FU-'+Date.now();o.created_at=now();o.completed_date=o.status==='Completed'?today():'';
    const client=read('boxwishCrmClients').find(c=>c.mobile===en.mobile||((c.company||'').toLowerCase()===(en.company||'').toLowerCase()));o.client_id=client&&client.client_id||'';o.assigned_to=o.assigned_to||user.id||who;
    const fus=read('boxwishCrmFollowUps');fus.unshift(o);write('boxwishCrmFollowUps',fus);
    const all=read('boxwishCrmEnquiries');const i=all.findIndex(x=>x.enquiry_id===en.enquiry_id);if(i>=0){all[i]={...all[i],next_followup_date:o.followup_date,next_followup_type:o.followup_type,next_followup_notes:o.notes,updated_at:now()};write('boxwishCrmEnquiries',all)}
    const acts=read('boxwishCrmActivities');acts.unshift({enquiry_id:en.enquiry_id,client_id:o.client_id,activity_type:'Follow-up Scheduled',description:o.followup_type+' scheduled for '+o.followup_date+(o.followup_time?' at '+o.followup_time:'')+' — '+o.notes,performed_by:who,created_at:now()});write('boxwishCrmActivities',acts);
    location.href='../enquiries/detail.html?id='+encodeURIComponent(en.enquiry_id);
  },true);
})();
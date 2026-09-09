/* Boxwish Biz CRM — Enquiry View navigation */
(function(){
  function enquiryUrl(id){
    const base=location.pathname.replace(/\/crm\/?$/,'/crm/enquiries/detail.html');
    return location.origin+base+'?id='+encodeURIComponent(id);
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-action="view-enquiry"]');
    if(!b)return;
    e.preventDefault();
    location.assign(enquiryUrl(b.dataset.id));
  },true);

  const original=window.renderEnquiries;
  if(typeof original!=='function')return;
  window.renderEnquiries=function(){
    original();
    document.querySelectorAll('#enquiryTable tbody tr').forEach(function(row){
      const edit=row.querySelector('[data-action="edit-enquiry"]');
      if(!edit)return;
      const id=edit.dataset.id;
      const actions=row.querySelector('.row-actions');
      if(actions && !actions.querySelector('[data-action="view-enquiry"]')){
        const view=document.createElement('button');
        view.className='link-btn';
        view.dataset.action='view-enquiry';
        view.dataset.id=id;
        view.textContent='View';
        actions.insertBefore(view,edit);
      }
    });
  };
  if(location.hash==='#enquiries')window.renderEnquiries();
})();

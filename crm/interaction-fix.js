/* Boxwish Biz CRM — interaction bridge for development preview */
(function(){
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-action]');
    if(!b)return;
    const a=b.dataset.action,id=b.dataset.id;
    try{
      if(a==='new-enquiry'){
        e.preventDefault();
        const p=location.pathname.replace(/\/crm\/?$/,'/crm/enquiries/new.html');
        location.assign(location.origin+p);
        return;
      }
      if(a==='edit-enquiry'){e.preventDefault();window.openEnquiryForm&&window.openEnquiryForm(id);return;}
      if(a==='delete-enquiry'){e.preventDefault();window.deleteEnquiry&&window.deleteEnquiry(id);return;}
      if(a==='new-client'){e.preventDefault();window.openClientForm&&window.openClientForm();return;}
      if(a==='edit-client'){e.preventDefault();window.openClientForm&&window.openClientForm(id);return;}
      if(a==='delete-client'){e.preventDefault();window.deleteClient&&window.deleteClient(id);return;}
      if(a==='view-client'){e.preventDefault();window.viewClient&&window.viewClient(id);return;}
      if(a==='new-quotation'){e.preventDefault();window.openQuotationForm&&window.openQuotationForm();return;}
      if(a==='edit-quotation'){e.preventDefault();window.openQuotationForm&&window.openQuotationForm(id);return;}
      if(a==='delete-quotation'){e.preventDefault();window.deleteQuotation&&window.deleteQuotation(id);return;}
      if(a==='new-fir'){e.preventDefault();window.openFirForm&&window.openFirForm();return;}
      if(a==='edit-fir'){e.preventDefault();window.openFirForm&&window.openFirForm(id);return;}
      if(a==='delete-fir'){e.preventDefault();window.deleteFir&&window.deleteFir(id);return;}
      if(a==='new-lpa'){e.preventDefault();window.openLpaForm&&window.openLpaForm();return;}
      if(a==='edit-lpa'){e.preventDefault();window.openLpaForm&&window.openLpaForm(id);return;}
      if(a==='delete-lpa'){e.preventDefault();window.deleteLpa&&window.deleteLpa(id);return;}
      if(a==='close-modal'){e.preventDefault();window.closeModal&&window.closeModal();return;}
    }catch(err){console.error('CRM action error:',a,err)}
  },true);
})();

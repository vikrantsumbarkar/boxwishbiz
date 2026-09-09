/* Boxwish Biz CRM — page based navigation */
(function(){
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-action="new-enquiry"]');
    if(!b)return;
    e.preventDefault();
    window.location.href='enquiries/new.html';
  },true);
})();

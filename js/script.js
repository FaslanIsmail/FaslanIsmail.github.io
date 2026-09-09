const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.desktop-nav');
toggle?.addEventListener('click',()=>{
  nav.classList.toggle('mobile-open');
});
nav?.addEventListener('click',()=>nav.classList.remove('mobile-open'));
const nav = document.querySelector('.nav');
document.querySelector('.menu')?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',(e)=>{
  glow.style.left=e.clientX+'px';
  glow.style.top=e.clientY+'px';
});

const reveal = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.animate(
        [{opacity:0, transform:'translateY(24px)'},{opacity:1, transform:'translateY(0)'}],
        {duration:650,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'}
      );
      reveal.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.project,.skill-group,.timeline-item,.facts > div,.about-content').forEach(el=>reveal.observe(el));

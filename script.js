const l=document.getElementById('loader');addEventListener('load',()=>setTimeout(()=>{l.style.opacity=0;setTimeout(()=>l.remove(),800)},700));const p=document.querySelector('.progress');addEventListener('scroll',()=>p.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%');const c=document.querySelector('.cursor'),r=document.querySelector('.ring');addEventListener('pointermove',e=>{if(c){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'}if(r){r.style.left=e.clientX+'px';r.style.top=e.clientY+'px'}});document.getElementById('mode')?.addEventListener('click',()=>document.body.classList.toggle('philosophy'));

/* ===== Horizontal slide controller ===== */
(() => {
  const track = document.querySelector('.horizontal-track');
  if (!track) return;
  const slides = [...track.querySelectorAll('.slide')];
  const buttons = [...document.querySelectorAll('.slide-nav-btn')];
  const current = document.getElementById('slideCurrent');
  const total = document.getElementById('slideTotal');
  let index = 0;
  let touchStartX = null;

  if (total) total.textContent = String(slides.length).padStart(2,'0');

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({left: index * window.innerWidth, behavior:'smooth'});
    buttons.forEach((b,n)=>b.classList.toggle('active', n === index));
    if (current) current.textContent = String(index + 1).padStart(2,'0');
  }

  buttons.forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));

  window.addEventListener('keydown', e => {
    if (['ArrowRight','PageDown'].includes(e.key)) { e.preventDefault(); goTo(index + 1); }
    if (['ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); goTo(index - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });

  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      goTo(index + (e.deltaY > 0 ? 1 : -1));
    }
  }, {passive:false});

  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, {passive:true});

  track.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 45) goTo(index + (dx < 0 ? 1 : -1));
    touchStartX = null;
  }, {passive:true});

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / Math.max(1, window.innerWidth));
      if (i !== index) {
        index = Math.max(0, Math.min(slides.length - 1, i));
        buttons.forEach((b,n)=>b.classList.toggle('active', n === index));
        if (current) current.textContent = String(index + 1).padStart(2,'0');
      }
      ticking = false;
    });
  }, {passive:true});

  window.addEventListener('resize', () => {
    track.scrollLeft = index * window.innerWidth;
  });

  goTo(0);
})();

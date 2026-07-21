document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.toggle('loading', !reducedMotion);

const loader = document.querySelector('.loader');
const count = document.querySelector('.loader-count');
const line = document.querySelector('.loader-line i');
let n = 0;
let loaderDone = reducedMotion;
let timer;

function finishLoader(){
  if(loaderDone) return;
  loaderDone = true;
  n = 100;
  count.textContent = '100';
  line.style.width = '100%';
  clearInterval(timer);
  setTimeout(() => {
    loader.classList.add('done');
    document.body.classList.remove('loading');
  }, 180);
}

if(!reducedMotion){
  timer = setInterval(() => {
    n += Math.ceil((100 - n) * .12);
    if(n >= 92) n = 92;
    count.textContent = String(n).padStart(2, '0');
    line.style.width = n + '%';
  }, 45);
  addEventListener('load', finishLoader, {once:true});
  setTimeout(finishLoader, 900);
}

const progress = document.querySelector('.scroll-progress i');
function updateProgress(){
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max ? scrollY/max : 0})`;
}
addEventListener('scroll', updateProgress, {passive:true});
addEventListener('resize', updateProgress);
updateProgress();

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
},{threshold:.08, rootMargin:'0px 0px -5% 0px'});

document.querySelectorAll('.section-head, .project-row, .case-intro, .about-copy').forEach((el, index) => {
  el.classList.add('reveal-content');
  el.style.setProperty('--delay', `${(index % 7) * 45}ms`);
});
document.querySelectorAll('.case-gallery').forEach(gallery => {
  gallery.querySelectorAll('.reveal-media').forEach((el, index) => {
    el.style.setProperty('--delay', `${Math.min(index * 55, 220)}ms`);
  });
});
document.querySelectorAll('.reveal-media, .reveal-content').forEach(el => io.observe(el));

const cursor = document.querySelector('.cursor');
if(matchMedia('(pointer:fine)').matches){
  addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('.project-row, .next-project, .media').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('visible'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  });
}

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
const mobileNavigation = matchMedia('(max-width: 900px)');

function setMenu(open, returnFocus = false){
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  toggle.textContent = open ? 'Close' : 'Menu';
  if(open) menu.querySelector('a').focus();
  else if(returnFocus) toggle.focus();
}

toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => {
  if(e.key === 'Escape' && menu.classList.contains('open')) setMenu(false, true);
});
const resetMenu = () => setMenu(false);
if(mobileNavigation.addEventListener) mobileNavigation.addEventListener('change', resetMenu);
else mobileNavigation.addListener(resetMenu);
setMenu(false);

// Subtle image movement on scroll
const media = [...document.querySelectorAll('.media img')];
let ticking = false;
function parallax(){
  const vh = innerHeight;
  media.forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if(r.bottom > 0 && r.top < vh){
      const offset = (r.top + r.height/2 - vh/2) / vh;
      img.style.transform = `scale(1.035) translateY(${offset * -12}px)`;
    }
  });
  ticking = false;
}
if(!reducedMotion && matchMedia('(pointer:fine)').matches){
  addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(parallax);
      ticking = true;
    }
  },{passive:true});
  parallax();
}

document.querySelectorAll('.motion-slider').forEach(slider => {
  const slides = [...slider.querySelectorAll('.motion-slide')];
  const counter = slider.querySelector('.motion-counter');
  const previous = slider.querySelector('.motion-prev');
  const next = slider.querySelector('.motion-next');
  const viewport = slider.querySelector('.motion-viewport');
  let activeIndex = 0;
  let visible = false;
  let touchStart = 0;

  function activate(index){
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((video, videoIndex) => {
      const active = videoIndex === activeIndex;
      video.classList.toggle('is-active', active);
      video.setAttribute('aria-hidden', String(!active));
      video.controls = active && reducedMotion;
      if(!active) video.pause();
    });

    const video = slides[activeIndex];
    if(!video.src){
      video.src = video.dataset.src;
      video.load();
    }
    if(visible && !reducedMotion) video.play().catch(() => {});
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  previous.addEventListener('click', () => activate(activeIndex - 1));
  next.addEventListener('click', () => activate(activeIndex + 1));
  slider.addEventListener('keydown', event => {
    if(event.key === 'ArrowLeft'){
      event.preventDefault();
      activate(activeIndex - 1);
    }
    if(event.key === 'ArrowRight'){
      event.preventDefault();
      activate(activeIndex + 1);
    }
  });
  viewport.addEventListener('touchstart', event => {
    touchStart = event.changedTouches[0].clientX;
  }, {passive:true});
  viewport.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if(Math.abs(distance) > 45) activate(activeIndex + (distance < 0 ? 1 : -1));
  }, {passive:true});

  const videoObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if(visible) activate(activeIndex);
    else slides.forEach(video => video.pause());
  }, {rootMargin:'200px 0px', threshold:.1});
  videoObserver.observe(slider);
});

document.querySelectorAll('.case-video').forEach(video => {
  if(reducedMotion) video.controls = true;

  const observer = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if(visible && !video.src){
      video.src = video.dataset.src;
      video.load();
    }
    if(visible && !reducedMotion) video.play().catch(() => {});
    else video.pause();
  }, {rootMargin:'200px 0px', threshold:.1});

  observer.observe(video);
});

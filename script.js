
document.body.classList.add('loading');

const loader = document.querySelector('.loader');
const count = document.querySelector('.loader-count');
const line = document.querySelector('.loader-line i');
let n = 0;
const timer = setInterval(() => {
  n += Math.ceil((100 - n) * .12);
  if (n >= 99) n = 100;
  count.textContent = String(n).padStart(2, '0');
  line.style.width = n + '%';
  if (n === 100) {
    clearInterval(timer);
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
    }, 350);
  }
}, 45);

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
    if(e.isIntersecting) e.target.classList.add('in-view');
  });
},{threshold:.08, rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.reveal-media').forEach(el => io.observe(el));

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
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'Close' : 'Menu';
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Menu';
}));

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
addEventListener('scroll', () => {
  if(!ticking){
    requestAnimationFrame(parallax);
    ticking = true;
  }
},{passive:true});
parallax();

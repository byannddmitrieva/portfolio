/* Load the original films only when their active layout enters the viewport. */
const lettyMotion=matchMedia('(prefers-reduced-motion: reduce)');
const lettyFilms=document.querySelectorAll('.letty-video');
const lettyFilmObserver=new IntersectionObserver(entries=>{for(const entry of entries){const film=entry.target;if(entry.isIntersecting&&!lettyMotion.matches){film.muted=true;film.play().catch(()=>{});}else{film.pause();}}},{rootMargin:'120px',threshold:0.01});
lettyFilms.forEach(film=>lettyFilmObserver.observe(film));
document.addEventListener('visibilitychange',()=>{if(document.hidden)lettyFilms.forEach(film=>film.pause());});

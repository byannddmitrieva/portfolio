/* New homepage behaviour; the existing hero animation in script.js is untouched. */
document.querySelectorAll('.home-project[data-project="letty"] .project-preview').forEach(frame => {
  const fitLogo = () => frame.style.setProperty('--letty-logo-scale', String(frame.clientWidth * .88 / 596.658));
  fitLogo();
  new ResizeObserver(fitLogo).observe(frame);
});
document.querySelectorAll('.home-work .work-filter').forEach(button => {
  button.addEventListener('click', () => {
    const title = document.querySelector('.home-work .work-title');
    if(title && button.dataset.filter === 'all') title.textContent = title.dataset.defaultTitle;
  });
});

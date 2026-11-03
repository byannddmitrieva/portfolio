/* Keep the portfolio's shared motion slider, with the five approved poster thumbnails. */
document.querySelectorAll('#samolet .motion-slider').forEach(slider => {
  const videos = [...slider.querySelectorAll('.motion-slide')];
  const thumbnails = [...slider.querySelectorAll('.samolet-motion-thumb')];
  const next = slider.querySelector('.motion-next');

  function syncActiveVideo(){
    videos.forEach((video, index) => {
      const active = video.classList.contains('is-active');
      video.controls = active;
      thumbnails[index].setAttribute('aria-pressed', String(active));
    });
  }

  thumbnails.forEach((button, index) => {
    button.addEventListener('click', () => {
      const current = videos.findIndex(video => video.classList.contains('is-active'));
      const steps = (index - current + videos.length) % videos.length;
      for(let step = 0; step < steps; step += 1) next.click();
      syncActiveVideo();
    });
  });

  const observer = new MutationObserver(syncActiveVideo);
  videos.forEach(video => observer.observe(video, {attributes:true, attributeFilter:['class']}));
  syncActiveVideo();
});

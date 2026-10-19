const progress = document.querySelector('.reading-progress span');
const prose = document.querySelector('.prose');
if (progress && prose) {
  const updateProgress = () => {
    const start = prose.offsetTop;
    const total = Math.max(1, prose.offsetHeight - window.innerHeight);
    progress.style.width = `${Math.max(0, Math.min(100, ((window.scrollY - start) / total) * 100))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

const tocLinks = [...document.querySelectorAll('.toc-sidebar a')];
if ('IntersectionObserver' in window && tocLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of tocLinks) {
        if (decodeURIComponent(link.hash.slice(1)) === entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-90px 0px -65% 0px' });
  document.querySelectorAll('.prose h2, .prose h3').forEach((heading) => observer.observe(heading));
}

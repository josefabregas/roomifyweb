/* Roomify single-property website — runtime behaviors.
 * - Hero carousel: cycle slides with crossfade + Ken Burns zoom
 * - Scroll reveal: IntersectionObserver toggles `.in-view`
 * - Nav: hide on scroll-down, show on scroll-up, frosted after 80px
 */

(function () {
  'use strict';

  // ─── Hero carousel ────────────────────────────────────────────────
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  if (slides.length > 1) {
    let idx = 0;
    slides[0].classList.add('active');
    // 6.5s per slide — enough for the Ken Burns zoom to register
    // without feeling like a slideshow. The CSS does the 1.5s
    // crossfade; we just rotate the active class.
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 6500);
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
  }

  // ─── Scroll reveal ────────────────────────────────────────────────
  const revealTargets = document.querySelectorAll(
    '.reveal, .gal-cell, .about-photo'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    // Fallback for very old browsers: just show everything.
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  // ─── Nav scroll behavior ──────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      if (y > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      // Hide on scroll-down (after we've moved past the hero), show
      // on scroll-up. The 120px threshold keeps the nav visible while
      // the user is still in the hero.
      if (y > 240 && y > lastY + 4) {
        nav.classList.add('hidden');
      } else if (y < lastY - 4) {
        nav.classList.remove('hidden');
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();

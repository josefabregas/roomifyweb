/* Shared lightbox + grid renderer for individual listing showcase
   pages. The page sets window.LISTING = { photos, pairs } BEFORE
   loading this script. Photos drive the grid; pairs (keyed by the
   after's filename) drive the before/after lightbox view. Pages
   that don't have paired befores can pass pairs: {}. */

(function () {
  const photos = (window.LISTING && window.LISTING.photos) || [];
  const pairs  = (window.LISTING && window.LISTING.pairs)  || {};

  function getBeforeFor(afterUrl) {
    const segs = afterUrl.split('/');
    const filename = segs[segs.length - 1];
    return pairs[filename] || null;
  }

  const grid = document.getElementById('photo-grid');
  if (!grid) return;

  photos.forEach((src, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'photo';
    wrap.addEventListener('click', () => openLightbox(idx));
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = '';
    wrap.appendChild(img);
    if (getBeforeFor(src)) {
      const badge = document.createElement('span');
      badge.className = 'pair-badge';
      badge.textContent = 'Before · After';
      wrap.appendChild(badge);
    }
    grid.appendChild(wrap);
  });

  let currentIdx = 0;
  function renderLightboxForIdx(idx) {
    const afterUrl = photos[idx];
    const beforeUrl = getBeforeFor(afterUrl);
    const singleImg = document.getElementById('lightbox-img');
    const pairEl   = document.getElementById('lightbox-pair');
    if (beforeUrl) {
      singleImg.style.display = 'none';
      pairEl.style.display = 'flex';
      document.getElementById('lightbox-before').src = beforeUrl;
      document.getElementById('lightbox-after').src  = afterUrl;
    } else {
      pairEl.style.display = 'none';
      singleImg.style.display = '';
      singleImg.src = afterUrl;
    }
    document.getElementById('lightbox-counter').textContent =
      `${idx + 1} / ${photos.length}`;
  }
  function openLightbox(idx) {
    currentIdx = idx;
    renderLightboxForIdx(idx);
    const lb = document.getElementById('lightbox');
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function navLightbox(delta) {
    currentIdx = (currentIdx + delta + photos.length) % photos.length;
    renderLightboxForIdx(currentIdx);
  }
  // Expose for inline onclick handlers in the HTML — keeping these
  // global avoids re-wiring the existing markup.
  window.closeLightbox = closeLightbox;
  window.navLightbox   = navLightbox;

  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
})();

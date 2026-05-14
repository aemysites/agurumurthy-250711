/*
 * Hero Centered Block
 * A hero block with centered content, prominent CTA, and image/video background support
 *
 * Content Model:
 * Row 1: Background media - either an image (picture) OR a video URL
 * Row 2+: Content - heading, description, CTA link (each in separate rows)
 *
 * Example usage in markdown:
 * | Hero Centered |
 * |---------------|
 * | ![background](image.jpg) |
 * | Welcome to Our Site |
 * | Description text here |
 * | [Get Started](/contact) |
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function isVideoUrl(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be')
    || lower.includes('vimeo.com') || lower.endsWith('.mp4')
    || lower.endsWith('.webm') || lower.endsWith('.mov');
}

function embedYoutube(url) {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const suffix = 'autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playsinline=1&rel=0';

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-centered-video-wrapper';
  wrapper.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${vid}?${suffix}&playlist=${vid}"
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
    allowfullscreen scrolling="no" title="Background video" loading="lazy"></iframe>`;
  return wrapper;
}

function embedVimeo(url) {
  const [, video] = url.pathname.split('/');
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-centered-video-wrapper';
  wrapper.innerHTML = `<iframe
    src="https://player.vimeo.com/video/${video}?autoplay=1&background=1&loop=1&muted=1"
    allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
    title="Background video" loading="lazy"></iframe>`;
  return wrapper;
}

function createVideoElement(source) {
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.className = 'hero-centered-video';

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${source.split('.').pop()}`);
  video.append(sourceEl);

  video.addEventListener('canplay', () => {
    video.muted = true;
    if (!prefersReducedMotion.matches) {
      video.play();
    }
  });

  return video;
}

function loadVideoBackground(container, link) {
  const url = new URL(link);
  let videoEl;

  if (link.includes('youtube') || link.includes('youtu.be')) {
    videoEl = embedYoutube(url);
  } else if (link.includes('vimeo')) {
    videoEl = embedVimeo(url);
  } else {
    videoEl = createVideoElement(link);
  }

  container.append(videoEl);
}

export default function decorate(block) {
  const rows = [...block.children];

  // Create content container
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-centered-content';

  // Create background container
  const bgContainer = document.createElement('div');
  bgContainer.className = 'hero-centered-background';

  let hasBackground = false;
  let videoUrl = null;

  // Process rows
  rows.forEach((row, index) => {
    const cell = row.querySelector(':scope > div');
    if (!cell) return;

    // First row - check for background media
    if (index === 0) {
      const picture = cell.querySelector('picture');
      const link = cell.querySelector('a');
      const textContent = cell.textContent.trim();

      if (picture) {
        // Image background
        bgContainer.append(picture);
        hasBackground = true;
        return;
      }

      // Check for video link (either as <a> or plain URL text)
      if (link && isVideoUrl(link.href)) {
        videoUrl = link.href;
        hasBackground = true;
        block.classList.add('video-background');
        return;
      }

      if (isVideoUrl(textContent)) {
        videoUrl = textContent;
        hasBackground = true;
        block.classList.add('video-background');
        return;
      }
    }

    // Content rows - extract content
    const clone = cell.cloneNode(true);
    // Check if this row is just a link (CTA button)
    const link = clone.querySelector('a');
    if (link && clone.textContent.trim() === link.textContent.trim()) {
      // This is a standalone link - make it a button
      const p = document.createElement('p');
      p.className = 'button-container';
      link.className = 'button';
      p.append(link);
      contentWrapper.append(p);
    } else {
      // Regular content - check for strong/bold text to make it a heading
      const strong = clone.querySelector('strong');
      if (strong && clone.textContent.trim() === strong.textContent.trim()) {
        const h1 = document.createElement('h1');
        h1.textContent = strong.textContent;
        contentWrapper.append(h1);
      } else if (clone.innerHTML.trim()) {
        const p = document.createElement('p');
        p.innerHTML = clone.innerHTML;
        contentWrapper.append(p);
      }
    }
  });

  // Clear block and rebuild structure
  block.textContent = '';

  if (hasBackground) {
    block.append(bgContainer);
    // Lazy load video if present
    if (videoUrl) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          loadVideoBackground(bgContainer, videoUrl);
        }
      });
      observer.observe(block);
    }
  } else {
    block.classList.add('no-background');
  }

  block.append(contentWrapper);
}

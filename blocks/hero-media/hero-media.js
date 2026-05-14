/*
 * Hero Media Block
 * A hero banner with configurable centered CTA and image/video background support
 *
 * Content Model:
 * Row 1: Background image (picture) - serves as video fallback if video provided
 * Row 2: Background video URL (optional) - YouTube, Vimeo, or direct MP4/WebM link
 * Row 3: Heading text
 * Row 4: Description text (optional)
 * Row 5: CTA button link
 * Row 6: Secondary CTA button link (optional)
 *
 * Example usage in markdown:
 * | Hero Media |
 * |------------|
 * | ![background](image.jpg) |
 * | https://youtube.com/watch?v=xxx |
 * | Welcome to Our Site |
 * | Discover amazing experiences |
 * | [Get Started](/contact) |
 * | [Learn More](/about) |
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function isVideoUrl(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes('youtube.com')
    || lower.includes('youtu.be')
    || lower.includes('vimeo.com')
    || lower.endsWith('.mp4')
    || lower.endsWith('.webm')
    || lower.endsWith('.mov');
}

function embedYoutube(url) {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const suffix = 'autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playsinline=1&rel=0&modestbranding=1';

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-media-video-wrapper';
  wrapper.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${vid}?${suffix}&playlist=${vid}"
    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
    allowfullscreen scrolling="no" title="Background video" loading="lazy"></iframe>`;
  return wrapper;
}

function embedVimeo(url) {
  const [, video] = url.pathname.split('/');
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-media-video-wrapper';
  wrapper.innerHTML = `<iframe
    src="https://player.vimeo.com/video/${video}?autoplay=1&background=1&loop=1&muted=1"
    allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
    title="Background video" loading="lazy"></iframe>`;
  return wrapper;
}

function createVideoElement(source, fallbackPicture) {
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.className = 'hero-media-video';

  // Add poster image from fallback picture if available
  if (fallbackPicture) {
    const img = fallbackPicture.querySelector('img');
    if (img && img.src) {
      video.setAttribute('poster', img.src);
    }
  }

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

  // Fallback handling - show image if video fails
  video.addEventListener('error', () => {
    if (fallbackPicture) {
      video.replaceWith(fallbackPicture.cloneNode(true));
    }
  });

  return video;
}

function loadVideoBackground(container, link, fallbackPicture) {
  try {
    const url = new URL(link);
    let videoEl;

    if (link.includes('youtube') || link.includes('youtu.be')) {
      videoEl = embedYoutube(url);
    } else if (link.includes('vimeo')) {
      videoEl = embedVimeo(url);
    } else {
      videoEl = createVideoElement(link, fallbackPicture);
    }

    container.append(videoEl);
  } catch (e) {
    // If video fails to load, fallback picture remains visible
    // eslint-disable-next-line no-console
    console.warn('Hero Media: Video failed to load, using fallback image');
  }
}

export default function decorate(block) {
  const rows = [...block.children];

  // Create containers
  const bgContainer = document.createElement('div');
  bgContainer.className = 'hero-media-background';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-media-content';

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'hero-media-cta-container';

  let fallbackPicture = null;
  let videoUrl = null;
  let hasBackground = false;

  // Process rows
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div');
    if (!cell) return;

    const picture = cell.querySelector('picture');
    const link = cell.querySelector('a');
    const textContent = cell.textContent.trim();

    // Check for picture (image background/fallback)
    if (picture && !fallbackPicture) {
      fallbackPicture = picture.cloneNode(true);
      bgContainer.append(picture);
      hasBackground = true;
      return;
    }

    // Check for video URL
    if (!videoUrl) {
      const videoLink = link?.href || textContent;
      if (isVideoUrl(videoLink)) {
        videoUrl = videoLink;
        block.classList.add('has-video');
        return;
      }
    }

    // Check if this is a standalone link (CTA button)
    if (link && textContent === link.textContent.trim()) {
      const btnWrapper = document.createElement('p');
      btnWrapper.className = 'button-container';

      // First CTA gets primary styling, subsequent get secondary
      const isPrimary = ctaContainer.children.length === 0;
      link.className = isPrimary ? 'button primary' : 'button secondary';

      btnWrapper.append(link);
      ctaContainer.append(btnWrapper);
      return;
    }

    // Check for heading (bold text or plain text as heading)
    const strong = cell.querySelector('strong');
    const isHeading = strong && textContent === strong.textContent.trim();

    if (isHeading || (!contentWrapper.querySelector('h1') && textContent && !link)) {
      // Create heading
      const h1 = document.createElement('h1');
      h1.textContent = isHeading ? strong.textContent : textContent;
      contentWrapper.append(h1);
    } else if (textContent && !link) {
      // Description paragraph
      const p = document.createElement('p');
      p.className = 'hero-media-description';
      p.innerHTML = cell.innerHTML;
      contentWrapper.append(p);
    }
  });

  // Append CTA container to content
  if (ctaContainer.children.length > 0) {
    contentWrapper.append(ctaContainer);
  }

  // Clear and rebuild block structure
  block.textContent = '';

  if (hasBackground) {
    block.append(bgContainer);

    // Lazy load video if present
    if (videoUrl) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          loadVideoBackground(bgContainer, videoUrl, fallbackPicture);
        }
      });
      observer.observe(block);
    }
  } else {
    block.classList.add('no-background');
  }

  block.append(contentWrapper);
}

const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');
const openButton = document.getElementById('openInvitation');
const rsvpButton = document.getElementById('rsvpButton');
const toast = document.getElementById('toast');
const leafLayer = document.getElementById('floatingLeaves');
const hero = document.querySelector('.hero');
const eventSection = document.querySelector('.event-section');

const motionStyles = document.createElement('link');
motionStyles.rel = 'stylesheet';
motionStyles.href = 'swan-motion.css';
document.head.appendChild(motionStyles);

const musicStyles = document.createElement('link');
musicStyles.rel = 'stylesheet';
musicStyles.href = 'music-disc.css';
document.head.appendChild(musicStyles);

const eventLeavesStyles = document.createElement('link');
eventLeavesStyles.rel = 'stylesheet';
eventLeavesStyles.href = 'event-leaves.css';
document.head.appendChild(eventLeavesStyles);

const pageBackgroundStyles = document.createElement('link');
pageBackgroundStyles.rel = 'stylesheet';
pageBackgroundStyles.href = 'page-background.css';
document.head.appendChild(pageBackgroundStyles);

const envelopeStyles = document.createElement('link');
envelopeStyles.rel = 'stylesheet';
envelopeStyles.href = 'envelope-opening.css';
document.head.appendChild(envelopeStyles);

const weddingAudio = new Audio('assets/audio/Maha%20Ftouni%20-%20Agmal%20Farha.mp3');
weddingAudio.loop = true;
weddingAudio.preload = 'auto';
weddingAudio.volume = 0.68;

let recordButton = null;

function syncRecordState() {
  if (!recordButton) return;
  const isPlaying = !weddingAudio.paused;
  recordButton.classList.toggle('is-playing', isPlaying);
  recordButton.setAttribute('aria-label', isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى');
  recordButton.setAttribute('aria-pressed', String(isPlaying));
}

if (hero) {
  recordButton = document.createElement('button');
  recordButton.className = 'record-disc';
  recordButton.type = 'button';
  recordButton.setAttribute('aria-label', 'تشغيل الموسيقى');
  recordButton.setAttribute('aria-pressed', 'false');
  recordButton.innerHTML = '<img src="assets/images/cd.png" alt="" />';
  hero.prepend(recordButton);

  recordButton.addEventListener('click', async () => {
    if (weddingAudio.paused) {
      try {
        await weddingAudio.play();
      } catch (_) {}
    } else {
      weddingAudio.pause();
    }
    syncRecordState();
  });
}

weddingAudio.addEventListener('play', syncRecordState);
weddingAudio.addEventListener('pause', syncRecordState);
weddingAudio.addEventListener('ended', syncRecordState);

if (eventSection) {
  const leafPositions = [
    'event-leaf--top-right',
    'event-leaf--mid-left',
    'event-leaf--lower-right',
    'event-leaf--bottom-left'
  ];

  leafPositions.forEach((positionClass) => {
    const leaf = document.createElement('img');
    leaf.className = `event-leaf ${positionClass}`;
    leaf.src = 'assets/images/leaves.png';
    leaf.alt = '';
    leaf.setAttribute('aria-hidden', 'true');
    eventSection.prepend(leaf);
  });
}

if (cover) {
  const swanScene = document.createElement('div');
  swanScene.className = 'swan-scene';
  swanScene.setAttribute('aria-hidden', 'true');
  swanScene.innerHTML = `
    <div class="swan-scene__stage">
      <img class="swan-scene__poster" src="assets/images/swans.png" alt="" />
      <video
        class="swan-scene__video"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        poster="assets/images/swans.png"
      >
        <source src="assets/video/swans.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="swan-scene__shade"></div>
  `;

  const video = swanScene.querySelector('.swan-scene__video');
  const poster = swanScene.querySelector('.swan-scene__poster');

  const showVideo = () => {
    swanScene.classList.add('has-video');
    video?.play().catch(() => {});
  };

  video?.addEventListener('loadeddata', showVideo, { once: true });
  video?.addEventListener('canplay', showVideo, { once: true });
  video?.addEventListener('error', () => {
    swanScene.classList.remove('has-video');
    poster?.removeAttribute('hidden');
  });

  cover.prepend(swanScene);

  cover.classList.add('has-envelope');

  const envelopeStage = document.createElement('div');
  envelopeStage.className = 'envelope-stage';
  envelopeStage.innerHTML = `
    <div class="envelope-stage__scene" aria-hidden="true">
      <img class="envelope-stage__base" src="assets/images/envelope.png" alt="" />
      <img class="envelope-stage__flap" src="assets/images/envelope.png" alt="" />
    </div>
    <button class="envelope-wax" type="button" aria-label="افتح الدعوة">
      <img src="assets/images/wax.png" alt="" />
    </button>
  `;

  const waxButton = envelopeStage.querySelector('.envelope-wax');
  let envelopeOpening = false;

  waxButton?.addEventListener('click', async () => {
    if (envelopeOpening) return;
    envelopeOpening = true;

    /* Start audio on the real user gesture so mobile browsers allow playback. */
    try {
      await weddingAudio.play();
    } catch (_) {}
    syncRecordState();

    envelopeStage.classList.add('is-opening');

    window.setTimeout(() => {
      envelopeStage.classList.add('is-done');
      openInvitation({ skipAudio: true });
    }, 1220);
  });

  cover.appendChild(envelopeStage);
}

async function openInvitation({ skipAudio = false } = {}) {
  if (cover.classList.contains('is-open')) return;
  cover.classList.add('is-open');
  invitation.classList.add('visible');
  invitation.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('locked');

  if (!skipAudio) {
    try {
      await weddingAudio.play();
    } catch (_) {}
    syncRecordState();
  }

  window.setTimeout(() => {
    document.querySelector('.hero .reveal')?.classList.add('in-view');
  }, 260);
}

openButton?.addEventListener('click', openInvitation);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.18,
  rootMargin: '0px 0px -6% 0px'
});

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

let toastTimer;
rsvpButton?.addEventListener('click', () => {
  window.clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3000);
});

function createLeaf() {
  if (document.visibilityState !== 'visible') return;

  const leaf = document.createElement('span');
  leaf.className = 'float-leaf';
  leaf.style.left = `${Math.random() * 100}%`;
  leaf.style.opacity = `${0.18 + Math.random() * 0.34}`;
  leaf.style.setProperty('--drift', `${Math.round(-80 + Math.random() * 160)}px`);
  leaf.style.animationDuration = `${9 + Math.random() * 7}s`;
  leaf.style.transform = `rotate(${Math.random() * 180}deg) scale(${0.6 + Math.random() * 0.7})`;
  leafLayer.appendChild(leaf);

  window.setTimeout(() => leaf.remove(), 17000);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(createLeaf, 1400);
}

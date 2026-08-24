const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');
const openButton = document.getElementById('openInvitation');
const toast = document.getElementById('toast');
const leafLayer = document.getElementById('floatingLeaves');
const hero = document.querySelector('.hero');
const eventSection = document.querySelector('.event-section');

/* Paste the deployed Google Apps Script /exec URL here after deployment. */
const RSVP_GOOGLE_SCRIPT_URL = '';

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

const countdownCalendarStyles = document.createElement('link');
countdownCalendarStyles.rel = 'stylesheet';
countdownCalendarStyles.href = 'countdown-calendar.css';
document.head.appendChild(countdownCalendarStyles);

const rsvpFormStyles = document.createElement('link');
rsvpFormStyles.rel = 'stylesheet';
rsvpFormStyles.href = 'rsvp-form.css';
document.head.appendChild(rsvpFormStyles);

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

const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
function toArabicDigits(value, minimumLength = 0) {
  return String(value)
    .padStart(minimumLength, '0')
    .replace(/\d/g, (digit) => arabicDigits[Number(digit)]);
}

if (eventSection) {
  const calendarDays = [null, null, ...Array.from({ length: 30 }, (_, index) => index + 1)];
  const calendarMarkup = calendarDays.map((day) => {
    if (day === null) return '<span class="calendar-day is-empty" aria-hidden="true">0</span>';
    const eventClass = day === 26 ? ' is-event' : '';
    const eventLabel = day === 26 ? ' aria-label="موعد حفل الزفاف، ٢٦ سبتمبر"' : '';
    return `<span class="calendar-day${eventClass}"${eventLabel}>${toArabicDigits(day)}</span>`;
  }).join('');

  const dateTools = document.createElement('section');
  dateTools.className = 'date-tools panel paper-panel';
  dateTools.innerHTML = `
    <div class="date-tools-inner reveal">
      <p class="date-tools-kicker" id="countdownTitle">باقي على يومنا</p>

      <div class="countdown" id="weddingCountdown" aria-label="العد التنازلي لموعد حفل الزفاف">
        <div class="countdown-unit">
          <span class="countdown-number" id="countdownDays">٠٠</span>
          <span class="countdown-label">يوم</span>
        </div>
        <div class="countdown-unit">
          <span class="countdown-number" id="countdownHours">٠٠</span>
          <span class="countdown-label">ساعة</span>
        </div>
        <div class="countdown-unit">
          <span class="countdown-number" id="countdownMinutes">٠٠</span>
          <span class="countdown-label">دقيقة</span>
        </div>
        <div class="countdown-unit">
          <span class="countdown-number" id="countdownSeconds">٠٠</span>
          <span class="countdown-label">ثانية</span>
        </div>
      </div>

      <div class="wedding-calendar" aria-label="تقويم سبتمبر ٢٠٢٦">
        <div class="calendar-heading">
          <strong>سبتمبر</strong>
          <span>2026</span>
        </div>
        <div class="calendar-weekdays" aria-hidden="true">
          <span>الأحد</span><span>الإثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span><span>السبت</span>
        </div>
        <div class="calendar-days">${calendarMarkup}</div>
        <p class="calendar-caption">السبت، ٢٦ سبتمبر ٢٠٢٦</p>
        <button class="add-calendar-button" id="addToCalendar" type="button">أضف الموعد للتقويم</button>
      </div>
    </div>
  `;

  eventSection.insertAdjacentElement('afterend', dateTools);

  const targetTime = new Date('2026-09-26T19:00:00+03:00').getTime();
  const countdownTitle = dateTools.querySelector('#countdownTitle');
  const dayNode = dateTools.querySelector('#countdownDays');
  const hourNode = dateTools.querySelector('#countdownHours');
  const minuteNode = dateTools.querySelector('#countdownMinutes');
  const secondNode = dateTools.querySelector('#countdownSeconds');
  let countdownTimer = null;

  const updateCountdown = () => {
    const distance = Math.max(0, targetTime - Date.now());
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    if (dayNode) dayNode.textContent = toArabicDigits(days, 2);
    if (hourNode) hourNode.textContent = toArabicDigits(hours, 2);
    if (minuteNode) minuteNode.textContent = toArabicDigits(minutes, 2);
    if (secondNode) secondNode.textContent = toArabicDigits(seconds, 2);

    if (distance === 0) {
      if (countdownTitle) countdownTitle.textContent = 'اليوم يومنا 🤍';
      if (countdownTimer) window.clearInterval(countdownTimer);
    }
  };

  updateCountdown();
  countdownTimer = window.setInterval(updateCountdown, 1000);

  dateTools.querySelector('#addToCalendar')?.addEventListener('click', () => {
    const calendarContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LaithAndAnwar//Wedding Invitation//AR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:laith-anwar-20260926@wedding-invitation',
      'DTSTAMP:20260823T000000Z',
      'DTSTART:20260926T160000Z',
      'DTEND:20260926T180000Z',
      'SUMMARY:حفل زفاف ليث وأنوار',
      'LOCATION:صالة الشرق للاحتفالات، القاعة الملوكية - إربد',
      'DESCRIPTION:نتشرف بحضوركم ومشاركتنا فرحتنا.',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Laith-Anwar-Wedding.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

function setupRsvpForm() {
  const rsvpContent = document.querySelector('.rsvp-content');
  if (!rsvpContent) return;

  rsvpContent.innerHTML = `
    <span class="tiny-flourish" aria-hidden="true">❦</span>
    <h2>حضوركم يُهمّنا</h2>
    <p class="rsvp-intro">وجودكم معنا يصنع للفرحة معنى أجمل، يسعدنا معرفة قراركم.</p>

    <form class="rsvp-form" id="rsvpForm" novalidate>
      <div class="rsvp-field">
        <label class="rsvp-field-label" for="guestName">اسم الضيف</label>
        <div class="rsvp-name-wrap">
          <span class="rsvp-name-icon" aria-hidden="true">✦</span>
          <input
            class="rsvp-name-input"
            id="guestName"
            name="name"
            type="text"
            autocomplete="name"
            maxlength="80"
            placeholder="اكتب اسمك هنا..."
            required
          />
        </div>
      </div>

      <fieldset class="rsvp-choice-fieldset">
        <legend class="rsvp-choice-legend">هل ستشاركونا فرحتنا؟</legend>
        <div class="rsvp-choice-list">
          <label class="rsvp-choice">
            <input type="radio" name="attendance" value="attending" required />
            <span class="rsvp-choice-surface">
              <span class="rsvp-choice-icon" aria-hidden="true">♡</span>
              <span class="rsvp-choice-title">سأحضر بكل سرور</span>
              <span class="rsvp-choice-subtitle">ننتظركم بمحبة</span>
            </span>
          </label>

          <label class="rsvp-choice">
            <input type="radio" name="attendance" value="not_attending" required />
            <span class="rsvp-choice-surface">
              <span class="rsvp-choice-icon" aria-hidden="true">❦</span>
              <span class="rsvp-choice-title">أعتذر عن الحضور</span>
              <span class="rsvp-choice-subtitle">محبتكم تصلنا دائمًا</span>
            </span>
          </label>
        </div>
      </fieldset>

      <button class="rsvp-submit" id="rsvpButton" type="submit">تأكيد الحضور</button>
      <p class="rsvp-form-status" id="rsvpFormStatus" role="status" aria-live="polite"></p>
    </form>
  `;

  const form = rsvpContent.querySelector('#rsvpForm');
  const submitButton = rsvpContent.querySelector('#rsvpButton');
  const statusNode = rsvpContent.querySelector('#rsvpFormStatus');

  const setStatus = (message, type = '') => {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.classList.remove('is-success', 'is-error');
    if (type) statusNode.classList.add(`is-${type}`);
  };

  form?.querySelectorAll('input[name="attendance"]').forEach((input) => {
    input.addEventListener('change', () => {
      if (!submitButton) return;
      submitButton.textContent = input.value === 'attending' ? 'تأكيد حضوري 🤍' : 'إرسال الاعتذار بلطف';
      setStatus('');
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('#guestName');
    const attendanceInput = form.querySelector('input[name="attendance"]:checked');
    const guestName = nameInput?.value.trim() || '';

    if (!guestName) {
      nameInput?.focus();
      setStatus('اكتب اسمك أولًا حتى نقدر نسجّل ردك.', 'error');
      return;
    }

    if (!attendanceInput) {
      setStatus('اختار إذا كنت ستحضر أو تعتذر عن الحضور.', 'error');
      return;
    }

    if (!RSVP_GOOGLE_SCRIPT_URL) {
      setStatus('الفورم جاهز للربط مع Google Sheet — باقي فقط رابط الـWeb App.', 'error');
      return;
    }

    const originalButtonText = submitButton?.textContent || 'تأكيد الحضور';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'جاري تسجيل ردّكم...';
    }
    setStatus('');

    const payload = new URLSearchParams({
      name: guestName,
      attendance: attendanceInput.value,
      submittedAt: new Date().toISOString(),
      source: 'LaithAndAnwar invitation'
    });

    try {
      await fetch(RSVP_GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });

      setStatus(
        attendanceInput.value === 'attending'
          ? `تم تسجيل حضورك يا ${guestName}، ننتظرك بكل فرح 🤍`
          : `تم تسجيل اعتذارك يا ${guestName}، ومحبتك وصلت 🤍`,
        'success'
      );

      if (toast) {
        window.clearTimeout(toast._hideTimer);
        toast.textContent = 'تم تسجيل ردّكم بنجاح 🤍';
        toast.classList.add('show');
        toast._hideTimer = window.setTimeout(() => toast.classList.remove('show'), 3000);
      }

      form.reset();
      if (submitButton) submitButton.textContent = 'تأكيد الحضور';
    } catch (_) {
      setStatus('صار خلل بسيط أثناء الإرسال. جرّب مرة ثانية.', 'error');
      if (submitButton) submitButton.textContent = originalButtonText;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

setupRsvpForm();

if (cover) {
  cover.classList.add('has-envelope');

  const envelopeStage = document.createElement('div');
  envelopeStage.className = 'envelope-stage';
  envelopeStage.innerHTML = `
    <video
      class="envelope-video"
      muted
      playsinline
      preload="auto"
      aria-hidden="true"
    >
      <source src="assets/video/envelope.mp4" type="video/mp4" />
    </video>

    <img
      class="envelope-still"
      src="assets/images/envelope.png"
      alt=""
      aria-hidden="true"
    />

    <button class="envelope-wax" type="button" aria-label="افتح الدعوة">
      <img src="assets/images/wax.png" alt="" />
    </button>
  `;

  const envelopeVideo = envelopeStage.querySelector('.envelope-video');
  const waxButton = envelopeStage.querySelector('.envelope-wax');
  let envelopeStarted = false;

  const keepVideoOnFirstFrame = () => {
    if (!envelopeVideo || envelopeStarted) return;
    try {
      envelopeVideo.pause();
      envelopeVideo.currentTime = 0;
    } catch (_) {}
  };

  envelopeVideo?.addEventListener('loadedmetadata', keepVideoOnFirstFrame, { once: true });
  envelopeVideo?.addEventListener('loadeddata', keepVideoOnFirstFrame, { once: true });

  const finishEnvelopeVideo = () => {
    openInvitation({ skipAudio: true });
  };

  envelopeVideo?.addEventListener('ended', finishEnvelopeVideo, { once: true });

  waxButton?.addEventListener('click', async () => {
    if (envelopeStarted) return;
    envelopeStarted = true;

    try {
      await weddingAudio.play();
    } catch (_) {}
    syncRecordState();

    if (!envelopeVideo) {
      finishEnvelopeVideo();
      return;
    }

    try {
      envelopeVideo.pause();
      envelopeVideo.currentTime = 0;

      /* Start the video and remove the still in the exact same interaction frame. */
      const playPromise = envelopeVideo.play();
      envelopeStage.classList.add('is-playing');
      await playPromise;
    } catch (_) {
      finishEnvelopeVideo();
    }
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

function createLeaf() {
  if (document.visibilityState !== 'visible') return;

  const leaf = document.createElement('span');
  leaf.className = 'float-leaf';
  leaf.style.left = `${Math.random() * 100}%`;
  leaf.style.opacity = `${0.18 + Math.random() * 0.34}`;
  leaf.style.setProperty('--drift', `${Math.round(-80 + Math.random() * 160)}px`);
  leaf.style.animationDuration = `${9 + Math.random() * 7}s`;
  leaf.style.transform = `rotate(${Math.random() * 180}deg) scale(${0.6 + Math.random() * 0.7})`;
  leafLayer?.appendChild(leaf);

  window.setTimeout(() => leaf.remove(), 17000);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(createLeaf, 1400);
}

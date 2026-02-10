(function () {
  const INHALE_COUNTS = 4;
  const EXHALE_COUNTS = 6;
  const INHALE_DURATION_MS = 4000;
  const EXHALE_DURATION_MS = 6000;

  const circleIds = ['circle1', 'circle2', 'circle3', 'circle4', 'circle5'];
  const circles = circleIds.map((id) => document.getElementById(id));
  const circlesContainer = document.getElementById('circlesContainer');
  const phaseLabel = document.getElementById('phaseLabel');
  const countEl = document.getElementById('count');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');

  let animationId = null;
  let isPaused = false;
  let phase = 'idle'; // 'idle' | 'inhale' | 'exhale'
  let phaseStartTime = 0;
  let pausedAt = 0;
  let totalPausedDuration = 0;

  function getContainerSize() {
    const rect = circlesContainer.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    return size / 2;
  }

  function setCircleSizes(radiusPerCircle) {
    const baseRadius = getContainerSize();
    circles.forEach((circle, i) => {
      const radius = Array.isArray(radiusPerCircle) ? radiusPerCircle[i] : radiusPerCircle;
      const r = (baseRadius * 0.28 * (i + 1)) * Math.max(0, radius);
      const size = Math.round(r * 2);
      circle.style.width = size + 'px';
      circle.style.height = size + 'px';
    });
  }

  function getElapsed() {
    if (isPaused) return pausedAt - phaseStartTime - totalPausedDuration;
    return (performance.now() - phaseStartTime) - totalPausedDuration;
  }

  function updateCountAndPhase() {
    const elapsed = getElapsed();
    const duration = phase === 'inhale' ? INHALE_DURATION_MS : EXHALE_DURATION_MS;
    const counts = phase === 'inhale' ? INHALE_COUNTS : EXHALE_COUNTS;
    const progress = Math.min(1, elapsed / duration);
    const currentCount = Math.min(counts, Math.floor(progress * counts) + 1);
    countEl.textContent = phase === 'idle' ? '' : String(currentCount);
    if (phase === 'inhale') {
      phaseLabel.textContent = 'Inhale through your nose';
    } else if (phase === 'exhale') {
      phaseLabel.textContent = 'Exhale slowly — shoulders down, jaw loose';
    }
  }

  function tick() {
    if (phase === 'idle') return;

    const elapsed = getElapsed();
    const duration = phase === 'inhale' ? INHALE_DURATION_MS : EXHALE_DURATION_MS;
    const progress = Math.min(1, elapsed / duration);

    const STAGGER = 0.08;
    const radii = circles.map((_, i) => {
      const delayed = (progress - i * STAGGER) / (1 - (circles.length - 1) * STAGGER);
      const p = Math.max(0, Math.min(1, delayed));
      return phase === 'inhale' ? p : 1 - p;
    });

    setCircleSizes(radii);
    updateCountAndPhase();

    if (progress >= 1) {
      if (phase === 'inhale') {
        phase = 'exhale';
        phaseStartTime = performance.now();
        totalPausedDuration = 0;
      } else {
        phase = 'inhale';
        phaseStartTime = performance.now();
        totalPausedDuration = 0;
      }
    }

    animationId = requestAnimationFrame(tick);
  }

  function start() {
    if (phase !== 'idle' && !isPaused) return;
    if (isPaused) {
      totalPausedDuration += performance.now() - pausedAt;
      isPaused = false;
      pauseBtn.textContent = 'Pause';
      pauseBtn.disabled = false;
    } else {
      phase = 'inhale';
      phaseStartTime = performance.now();
      totalPausedDuration = 0;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    }
    animationId = requestAnimationFrame(tick);
  }

  function pause() {
    if (phase === 'idle' || isPaused) return;
    isPaused = true;
    pausedAt = performance.now();
    pauseBtn.textContent = 'Resume';
    if (animationId != null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function reset() {
    if (animationId != null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    phase = 'idle';
    isPaused = false;
    setCircleSizes(0);
    phaseLabel.textContent = 'Breathe with the circle';
    countEl.textContent = '';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    stopBtn.disabled = true;
  }

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', function () {
    if (isPaused) start();
    else pause();
  });
  stopBtn.addEventListener('click', reset);

  window.addEventListener('resize', function () {
    if (phase !== 'idle') return;
    setCircleSizes(0);
  });

  setCircleSizes(0);
})();

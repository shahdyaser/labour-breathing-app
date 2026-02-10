(function () {
  const INHALE_COUNTS = 4;
  const EXHALE_COUNTS = 6;
  const INHALE_DURATION_MS = 4000;
  const EXHALE_DURATION_MS = 6000;

  const flame = document.getElementById('flame');
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

  function getElapsed() {
    if (isPaused) return pausedAt - phaseStartTime - totalPausedDuration;
    return (performance.now() - phaseStartTime) - totalPausedDuration;
  }

  function setFlameState(phaseName, progress) {
    const baseTransform = 'translateX(-50%)';
    if (phaseName === 'inhale') {
      flame.classList.remove('lit');
      // Fire grows from small to fully lit over the 4-second inhale
      const scale = Math.max(0, progress);
      const opacity = Math.max(0, progress);
      // Subtle flicker when nearly fully lit
      const flicker = progress > 0.7 ? 1 + 0.04 * Math.sin(performance.now() / 40) : 1;
      flame.style.opacity = String(opacity);
      flame.style.transform = baseTransform + ' scale(' + (scale * flicker) + ')';
    } else if (phaseName === 'exhale') {
      flame.classList.remove('lit');
      const scale = Math.max(0, 1 - progress);
      const opacity = Math.max(0, 1 - progress);
      flame.style.opacity = String(opacity);
      flame.style.transform = baseTransform + ' scale(' + scale + ')';
    } else {
      flame.classList.remove('lit');
      flame.style.opacity = '0';
      flame.style.transform = baseTransform + ' scale(0)';
    }
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
      phaseLabel.textContent = 'Exhale slowly — blow out the candle';
    }
  }

  function tick() {
    if (phase === 'idle') return;

    const elapsed = getElapsed();
    const duration = phase === 'inhale' ? INHALE_DURATION_MS : EXHALE_DURATION_MS;
    const progress = Math.min(1, elapsed / duration);

    setFlameState(phase, progress);
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
    setFlameState('idle');
    phaseLabel.textContent = 'Breathe with the candle';
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

  setFlameState('idle');
})();
